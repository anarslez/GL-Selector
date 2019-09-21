from django.conf.urls import url
from . import views           # This line is new!
urlpatterns = [
    url(r'^capture$', views.capture), # Analyze pics sent to Python
    url(r'^preregister$', views.preregister), # Check registration info to make sure it's valid
    url(r'^login$', views.login), # Log our prospective user in
    url(r'^retrieve$', views.retrieve), #Retrieve user info before displaying in dashboard
]