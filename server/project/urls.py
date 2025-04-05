from django.urls import path
from . import views

urlpatterns = [
    path("signup/", views.signup, name="signup"),
    path("login/", views.login, name="login"),
    path("offers/", views.offer_list, name="offer_list"),  # handles GET and POST
    path(
        "offers/<uuid:offer_id>/", views.offer_detail, name="offer_detail"
    ),  # handles GET and PATCH
    path("users/", views.user_list, name="user_list"),
    path("users/<uuid:user_id>/", views.user_detail, name="user_detail"),
]
