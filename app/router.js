'use strict';

/**
 * @param {Egg.Application} app - egg application
 */

module.exports = app => {
  const rv = app.middlewares.routerView;
  // const less = app.middlewares.less;
  const { router, controller } = app;
  console.log('app:', app);
  // await less();
  router.get('/', controller.home.default);
  router.get('/test', rv('index'), controller.home.test);
  router.get('/serve', controller.home.serveTest);
  router.get('/demo', controller.home.demo);

  router.get('/case-list', rv('case-list'), controller.home.caseList);
  router.get('/websiteContent/list', controller.home.websiteContent);
  router.get('/case-detail/:id', rv('case-detail'), controller.home.caseDetail);

  router.get('/recent-list', rv('recent-list'), controller.home.recentList);
  router.get('/cpy-news', rv('cpy-news'), controller.home.cpyNews);
  router.get('/product-news', rv('product-news'), controller.home.productNews);

  router.get('/erp-school', rv('erp-school'), controller.home.erpSchool);
  router.get('/trust-circle', rv('trust-circle'), controller.home.trustCircle);
  router.get('/infor-train', rv('infor-train'), controller.home.inforTrain);
  router.get('/team-build', rv('team-build'), controller.home.teamBuild);

  router.get('/news-detail/:id', rv('news_detail'), controller.home.newsDetail);
  router.get('/product-detail/:id', rv('product_detail'), controller.home.newsDetail);
  router.get('/lesson-detail/:id', rv('lesson_detail'), controller.home.newsDetail);
  router.get('/view-detail/:id', rv('view-detail'), controller.home.viewDetail);

  router.get('/erp-index', rv('erp-index'), controller.home.erpIndex);


  router.get('/404', rv('404'), controller.home.errPage);
};
