import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
/*
  Generated class for the HttpSerProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export class AppGlobal {
  //缓存key的配置
  static cache: any = {
      slides: "_dress_slides",
      categories: "_dress_categories",
      products: "_dress_products"
  }
  //接口基地址
  static domain = "http://110.185.185.146:8004"

  //接口地址
  static API: any = {
      getCategories: '/api/ionic3/getCategories',
      getProducts: '/api/ionic3/getProducts',
      getDetails: '/api/ionic3/details'
  };
}

@Injectable()
export class HttpSerProvider {
  constructor(public http: HttpClient) {
    console.log('Hello HttpSerProvider Provider');
  }
  public post(url: string, params: any = null, successCallback, errorCallback): any {
    // 此处使用的post模式为非严格模式，如果要使用严格模式，请把参数放在第二个位置 覆盖null
    return this.http.post(AppGlobal.domain +url, null, {
      params: params
    }).subscribe((res: any) => {
      this.responseSuccess(res, function (msg) {
        if (successCallback) {
          successCallback(res, msg);
        }
      });
    }, err => {
      if (errorCallback) {
        errorCallback(err);
      }
    });
  }
  // get数据
  public getdata(url: string, params?: any): any {
    return this.http.get(url, params);
  }
  // 删除相关请求
  public delete(url: string, params?: any): any {
    return this.http.delete(url, params);
  }
 
  /**
   * 处理响应的事件
   * @param res
   * @param {Function} error
   */
  private responseSuccess(res: any, callback) {
    if (res.code !== '0') { // 失败
      if (res.msg) {
        callback({code: res.code, msg: res.msg});
      } else {
        const data = res.data;
        let errorMsg = '操作失败！';
        data.map(i => {
          errorMsg = i.errorMsg + '\n';
        });
        callback({code: res.code, msg: errorMsg});
      }
    } else {
      callback(res);
    }
  }
 
  /**
   * 处理请求失败事件
   * @param url
   * @param err
   */
  // private requestFailed(url: string, err) {
  //   let msg = '请求发生异常';
  //   const status = err.status;
  //   if (status === 0) {
  //     msg = '请求失败，请求响应出错';
  //   } else if (status === 404) {
  //     msg = '请求失败，未找到请求地址';
  //   } else if (status === 500) {
  //     msg = '请求失败，服务器出错，请稍后再试';
  //   } else {
  //     msg = '未知错误，请检查网络';
  //   }
  //   return msg;
 
  // }
}
