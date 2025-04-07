from django.urls import path
from . import views
from .views import UserSignupView, UserLoginView, ServiceCategoryListView, JobCreateView

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
]
