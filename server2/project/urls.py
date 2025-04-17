from django.urls import path
from . import views
from .views import (
    UserSignupView,
    UserLoginView,
    ServiceCategoryListView,
    JobCreateView,
    JobsByClientView,
    JobsForSeekersView,
    JobApplicationView,
    MyApplicationsView,
    UserProfileUpdateView,
    RequestedApplicationsView,
    UserPostedJobsView,
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
    path("jobs/available/", JobsForSeekersView.as_view(), name="jobs-for-seekers"),
    path("jobs/apply/", JobApplicationView.as_view(), name="job-apply"),
    path("jobs/my-applications/", MyApplicationsView.as_view(), name="my-applications"),
    path("user/profile/", UserProfileUpdateView.as_view(), name="user-profile"),
    path(
        "user/requested-applications/",
        RequestedApplicationsView.as_view(),
        name="requested-applications",
    ),
    path("jobs/user-posted/", UserPostedJobsView.as_view(), name="user-posted-jobs"),
]
