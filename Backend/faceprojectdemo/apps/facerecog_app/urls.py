from django.urls import include, path
from django.conf.urls import include, url
from rest_framework import routers

from . import views

          # This line is new!
urlpatterns = [
    path('register/', views.register, name='register'), # registers a user
    # path('capture/', views.capture, name='capture'), # Analyze pics sent to Python
    path('login/', views.login, name='login'), # Log our prospective user in
    path('logout/', views.logout, name='logout'), # Log our prospective user in
#     path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^retrieve/(?P<id>\d+)/$', views.retrieve, name='retrieve'), # Retrieve user images on dashboard when logged in
    url(r'^capture/$', views.capture),
    url(r'^capture/(?P<id>\d+)/$', views.capture),
]
