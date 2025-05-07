from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LavanderiaViewSet, MaquinaViewSet, PagamentoViewSet, ConsultaMaquinaViewSet

router = DefaultRouter()
router.register(r'lavanderias', LavanderiaViewSet)
router.register(r'maquinas', MaquinaViewSet)
router.register(r'pagamentos', PagamentoViewSet)
router.register(r'consulta-maquinas', ConsultaMaquinaViewSet, basename='consultamaquina')

urlpatterns = [
    path('', include(router.urls)),
]

