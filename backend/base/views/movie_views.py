from os import stat
from unicodedata import category
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from base.models import Movie, Review
from base.serializers import MovieSerializer

from rest_framework import status


@api_view(['GET'])
def getMovies(request):
    query = request.query_params.get('keyword')
    if query == None:
        query = ''

    movies = Movie.objects.filter(title__icontains=query)

    page = request.query_params.get('page')
    paginator = Paginator(movies, 5)

    try:
        movies = paginator.page(page)
    except PageNotAnInteger:
        movies = paginator.page(1)
    except EmptyPage:
        movies = paginator.page(paginator.num_pages)

    if page == None:
        page = 1
    
    page = int(page)

    serializer = MovieSerializer(movies, many=True)
    
    return Response({'movies': serializer.data, 'page': page, 'pages': paginator.num_pages})


@api_view(['GET'])
def getMovie(request, pk):
    movie = Movie.objects.get(_id=pk)
    serializer = MovieSerializer(movie, many=False)

    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def createMovie(request):
    user = request.user
    movie = Movie.objects.create(
        user=user, 
        title='Sample Title',
        category='Sample Category',
        description='Sample Description',
        )
    serializer = MovieSerializer(movie, many=False)

    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateMovie(request, pk):
    data = request.data
    movie = Movie.objects.get(_id=pk)

    movie.title = data['title']
    movie.category = data['category']
    movie.description = data['description']

    serializer = MovieSerializer(movie, many=False)

    movie.save()

    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteMovie(request, pk):
    movie = Movie.objects.get(_id=pk)
    movie.delete()

    return Response('Movie deleted!')


@api_view(['POST'])
def uplaodImage(request):
    data = request.data
    print(data)

    movie_id = data.get('movieId')
    movie = Movie.objects.get(_id=movie_id)

    movie.image = request.FILES.get('image')
    movie.save()

    return Response('Image was uploaded.')


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createMovieReview(request, pk):
    user = request.user
    movie = Movie.objects.get(_id=pk)
    data = request.data 

    alreadyExists = movie.review_set.filter(user=user).exists()

    if alreadyExists:
        content = {'detail': 'Movie already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    elif data['rating'] == 0:
        content = {'detail': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    else:
        review = Review.objects.create(
            user=user,
            movie=movie,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment'],
        )

        reviews = movie.review_set.all()
        movie.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating

        movie.rating = total / len(reviews)
        movie.save()

        return Response('Review added')
