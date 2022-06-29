from django.urls import path
from base.views import movie_views as views



urlpatterns = [
    path('', views.getMovies, name='movies'),

    path('create/', views.createMovie, name='movie-create'),
    path('upload/', views.uplaodImage, name='image-upload'),

    path('<str:pk>/reviews/', views.createMovieReview, name='create-review'),
    path('<str:pk>/', views.getMovie, name='movie'),

    path('update/<str:pk>/', views.updateMovie, name='movie-update'),
    path('delete/<str:pk>/', views.deleteMovie, name='movie-delete'),
]