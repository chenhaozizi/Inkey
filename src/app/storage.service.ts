// import { LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import {Storage} from '@ionic/storage';


@Injectable()
export class AppStorage {


    constructor(public stor:Storage) {

     }

     setStorage(key,value){
        this.stor.set(key,value)
     }
     getStorage(key,callback){
        this.stor.get(key).then((val) => {
           console.log(val)
           callback(val)
            return val
        })
     }
     
   

}