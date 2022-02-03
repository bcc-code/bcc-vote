import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';

const router: any = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
}); 
 
router.beforeEach(async(to: any) => {
    if(router.$gtag)
        router.$gtag.event('page_view', {'page_title': to.name});
});

export default router;
