
function localSearch(key, v) {
  let query = setUrlParam(key, v);
  if (query) {
    query = setUrlParam('page', '', query);
  }
  if (query) {
    query = setUrlParam('s', '', query);
  }
  window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname + query;
}

// 设置当前窗口url中param的值
function setUrlParam(param, value, query) {
  query = query || location.search;
  query = query.substring(1);
  const p = new RegExp('(^|&)' + param + '=([^&]*)');
  if (p.test(query)) {
    let r = '$1' + param + '=' + value;
    if (!value) {
      r = '';
    }
    query = query.replace(p, r);
    if (query) {
      if (query.indexOf('&') == 0) {
        query = query.substring(1);
      }
      return '?' + query;
    }
    return '';

  }
  if (query == '' && value) {
    return '?' + param + '=' + value;
  }
  if (!value) {
    return query ? '?' + query : '';
  }
  return '?' + query + '&' + param + '=' + value;
}
