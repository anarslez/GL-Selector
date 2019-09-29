from django.urls import include, path
from django.conf.urls import include, url
from rest_framework import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from . import views

          # This line is new!
urlpatterns = [
    path('register', views.register, name='register'), # registers a user
    path('capture', views.capture, name='capture'), # Analyze pics sent to Python
    path('login', views.login, name='login'), # Log our prospective user in
    path('logout', views.logout, name='logout'), # Log our prospective user in
    path('retrieve', views.retrieve, name='retrieve'), #Retrieve user info before displaying in dashboard
#     path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
