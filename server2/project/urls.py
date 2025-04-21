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
    JobRequestListView,
    JobRequestUpdateView,
    JobDeleteView,
    JobCompleteView,
    NonVerifiedUsersView,
    AcceptUserView,
    CompletedJobsView,
    DeleteUserView,
    AllUsersView,
)

urlpatterns = [
    path("", views.index, name="index"),
    path("signup/", UserSignupView.as_view(), name="user-signup"),
    path("login/", UserLoginView.as_view(), name="user-login"),
    path("users/", AllUsersView.as_view(), name="all-users"),
    path(
        "non-verified-users/", NonVerifiedUsersView.as_view(), name="non_verified_users"
    ),
    path("accept-user/", AcceptUserView.as_view(), name="accept_user"),
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
    path("jobs-requests/", JobRequestListView.as_view(), name="job-request-list"),
    path(
        "job-acceptance/",
        JobRequestUpdateView.as_view(),
        name="job-request-update",
    ),
    path("jobs/delete/", JobDeleteView.as_view(), name="job-delete"),
    path("jobs/complete/", JobCompleteView.as_view(), name="job-complete"),
    path("jobs/completed/", CompletedJobsView.as_view(), name="completed-jobs"),
    path("user/delete/", DeleteUserView.as_view(), name="delete-user"),
]
