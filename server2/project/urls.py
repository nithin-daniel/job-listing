from django.urls import path
from . import views
from .views import (
    UserSignupView,
    UserLoginView,
    ServiceCategoryListView,
    JobCreateView,
    JobsByClientView,
)

urlpatterns = [
    path("", views.index, name="index"),
    path("signup/", UserSignupView.as_view(), name="user-signup"),
    path("login/", UserLoginView.as_view(), name="user-login"),
    path(
        "service-categories/",
        ServiceCategoryListView.as_view(),
        name="service-categories",
    ),
    path("jobs/create/", JobCreateView.as_view(), name="job-create"),
    path("jobs/client/", JobsByClientView.as_view(), name="jobs-by-client"),
]
