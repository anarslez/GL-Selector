from django.urls import include, path
from django.conf.urls import include
from rest_framework import routers
from . import views
          # This line is new!
urlpatterns = [
    path('capture', views.capture.as_view(), name='capture'), # Analyze pics sent to Python
    path('login', views.login.as_view(), name='login'), # Log our prospective user in
    path('logout', views.logout.as_view(), name='logout'), # Log our prospective user in
    path('retrieve', views.retrieve.as_view(), name='retrieve'), #Retrieve user info before displaying in dashboard
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]