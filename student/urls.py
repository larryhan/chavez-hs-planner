from django.conf.urls import url, include
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    url(r'^$', views.show_home, name='show_home'),
    #for django-allauth
    url(r'^accounts/', include('allauth.urls')),
    url(r'^homeroom/(?P<selected_hr>[a-zA-Z0-9]+)$', views.show_hr, name='show_hr'),
    url(r'^student/dashboard/', views.show_dashboard, name='show_dashboard'),
    url(r'^upload_files/$', views.upload_files),
    url(r'^summerschool/$', views.summer_school),
    url(r'^staffattend/$', views.show_teacher_attendance, name="show_teacher_attendance"),
    url(r'^summerschoolresults/$', views.download_summer_school, name="download_ss"),
    url(r'^grade_report/$', views.grade_report),
    url(r'^react/$', views.show_test_react, name='show_test_react'),

    url(r'^student/$', views.show_student, name='show_student'),
    url(r'^student/(?P<student_id>[0-9]+)$', views.show_student, name='show_student'),

    url(r'^student/grades/$', views.show_student_grades, name='show_student_grades'),
    url(r'^student/grades/(?P<student_id>[0-9]+)$', views.show_student_grades, name='show_student_grades'),

    url(r'^student/assignments/(?P<student_id>[0-9]+)/(?P<display_subject>[^/]+)$',
    views.show_student_assignments, name='show_student_assignments'),


    url(r'^student/highschool/$', views.show_hs_options, name='show_hs_options'),
    url(r'^student/highschool/(?P<student_id>[0-9]+)$', views.show_hs_options, name='show_hs_options'),

    url(r'^student/attendance/$', views.show_student_attendance, name='show_student_attendance'),
    url(r'^student/attendance/(?P<student_id>[0-9]+)$', views.show_student_attendance, name='show_student_attendance'),

    url(r'^student/ontrack/$', views.show_student_ontrack, name='show_student_ontrack'),
    url(r'^student/ontrack/(?P<student_id>[0-9]+)$', views.show_student_ontrack, name='show_student_ontrack'),


]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
