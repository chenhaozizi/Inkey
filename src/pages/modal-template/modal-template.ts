import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController, ModalController } from 'ionic-angular';
import { AppService } from "../../app/app.service";
/**
 * Generated class for the ModalTemplatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-template',
  templateUrl: 'modal-template.html',
})
export class ModalTemplatePage {
  title;
  type;
  obj = []

  //手动新增客户
  name;
  tel;
  birthday;
  url = '../../assets/icon/user.jpg';
  cusarr;
  id;
  oldName = '';
  oldphone = '';
  sex = 3;
  IsOrderClient;
  Grade;
  oldRemark = '';
  token;
  constructor(public navCtrl: NavController, public appserve: AppService, public modalCtrl: ModalController, public navParams: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController) {
    this.title = this.navParams.get('title');
    this.type = this.navParams.get('type');
    this.id = this.navParams.get('id');
    this.birthday =0;
    this.appserve.getItem("user_token", res => {
      this.token = res
    })
    console.log('操作类型type: 1 ,新增顾客  2 修改顾客：',this.type, '当前标题:',this.title)
    if (this.type == 2) {
      this.getCustomer(this.id);
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalTemplatePage');
  }
  // 确定操作按钮
  dismiss() {
    if (this.type == 1) {
      console.log("添加自然到店的顾客");
      if (this.oldName == '' || this.oldName == undefined) {
        this.showWarn('请填写顾客名');
      } else if(this.oldphone==''||this.oldphone.length!==11){
        this.showWarn('请填写正确的手机号');
      }else {
        this.addCustomer();
      }
    }


    if (this.type == 2) {
      console.log("修改客户备注和意向等级")
      if (this.oldName == '' || this.oldName == undefined) {
        this.showWarn('请输入备注名')
      } else {
        //  'remark':this.oldRemark,'tel':this.oldphone,
        if (this.IsOrderClient) {
          this.IsOrderClient = 1
        } else {
          this.IsOrderClient = 0
        }
        if (this.Grade) {
          this.Grade = 1
        } else {
          this.Grade = 0
        }
        let data = { data: { 'Name': this.oldName, 'Grade': this.Grade, "CustomerId": this.id, 'Remark': this.oldRemark, 'Phone': this.oldphone, 'Sex': this.sex, "Logo": '', "IsOrderClient": this.IsOrderClient } }
        console.log(data)
        this.appserve.httpPost('/Api/Customer/ModifyCustomer', data.data, res => {
          console.log(res)
          if (res) {
            this.viewCtrl.dismiss(data);
          }
        }, false, this.token)

      }
    }
  }
  // 提示消息
  showWarn(str: any) {
    const confirm = this.alertCtrl.create({
      title: '提示',
      message: str,
      buttons: [
        {
          text: '确定',
          handler: () => {
            console.log('ok');
          }
        }
      ]
    });
    confirm.present();
  }
  // 取消操作按钮
  cancel() {
    var data = { 'status': false }
    this.viewCtrl.dismiss(data);
  }
  // 修改信息的时候请求客户详情
  getCustomer(id: number) {
    this.appserve.httpGet('/Api/Customer/GetCustomerById', { customerId: id }, res => {
      if (res) {
        console.log('请求的客户详细信息', res)
        //sex 1:女  2：男
        this.cusarr = res.Item;
        this.oldName = this.cusarr.Name; this.oldphone = res.Item.Phone; this.sex = res.Item.Sex; this.IsOrderClient = res.Item.IsOrderClient; this.Grade = res.Item.Grade; this.oldRemark = res.Item.Remark
      } else {
        
        console.log("token无效")
      }
    }, true, '')
  }
  // 导购手动新增客户
  addCustomer() {
    console.log(this.birthday)
    // var date = new Date(this.birthday)
    // console.log(date.getTime())
    let parm = { "Name": this.oldName, "Sex": this.sex, "Phone": this.oldphone, "Grade": this.Grade ? 1 : 0, "Birthday":new Date(this.birthday).getTime(), "Logo": "" }
    console.log(parm)
    this.appserve.httpPost('/Api/Customer/AddCustomer', parm, res => {
      console.log('添加顾客操作后返回的数据：', res);
      if (res.Item.IsValid) {
        console.log('添加完毕 跳 回 手动添加顾客列表')
        let data = { 'status': true }
        this.viewCtrl.dismiss(data);
      }else{
        console.log('添加失败 跳回手动添加顾客列表')
        let data = { 'status': false }
        this.viewCtrl.dismiss(data);
      }
    }, true, this.token)
  }
}
