import { Component } from '@angular/core';
import { IonicPage, ActionSheetController, ModalController, NavParams, App, ViewController, NavController } from 'ionic-angular';
import { RegPersonMember } from '../../class/RegPersonMember';
import { ApiurlService } from '../../service/apiurl.service';
import { AlertService } from '../../service/alert.service';
import { ErrorEnum } from '../../model/enumclasses';
import { ThemeService } from '../../service/theme.service';
import { ContextService } from '../../service/context.service';
import { getSessionData, removeSessionData } from '../../util/util';
import { PageJump } from '../../enum/enum';
import { I18NPipe } from '../../pipe/I18NPipe';
@IonicPage()
@Component({
    selector: 'page-msg-next',
    templateUrl: 'msg-next.html',
})
export class MsgNextPage {
    m_objMebInfo: RegPersonMember = {
        mobile: getSessionData("msgToMsgNext").sMobile,
        mebName: "",
        password: "",
        sex: 1,
        docType:1,
        docNo:"",
        sexName:this.m_objI18NPipe.transform("先生[先生]")
    };
    m_bEye: boolean = true;
    m_bRegister: boolean = true;
    m_bIsShowMebName = true;
    m_sTitle: string = this.m_objI18NPipe.transform("完善您的个人信息[完善您的个人信息]");
    m_sPasswordType: string = "password";
    constructor(
        public m_objModalCtrl: ModalController,
        public m_objActionsheetCtrl: ActionSheetController,
        public m_objApiUrl: ApiurlService,
        public m_objAlertService: AlertService,
        public m_objThemeService: ThemeService,
        public m_objContextService: ContextService,
        private m_objNavparams: NavParams,
        private m_objViewCtrl: ViewController,
        private m_objNavCtrl: NavController,
        private m_objApp: App,
        private m_objI18NPipe:I18NPipe

    ) {
        if (getSessionData('pq_PageJump') == PageJump.ForgetLoginPassword) {
            this.m_bIsShowMebName = false;
            this.m_sTitle = this.m_objI18NPipe.transform("重置登录密码[重置登录密码]")
		}

		//刪除以防止login頁面跳轉錯誤
		removeSessionData("source");
    }
    //选择性别
    ChooseSex():void {
        var actionSheet = this.m_objActionsheetCtrl.create({
            title: this.m_objI18NPipe.transform('请选择您的性别[请选择您的性别]'),
            buttons: [
                {
                    text: this.m_objI18NPipe.transform("先生[先生]"),
                    handler: () => {
                        this.m_objMebInfo.sex = 1;
                        this.m_objMebInfo.sexName = this.m_objI18NPipe.transform("先生[先生]");
                    }
                }, {
                    text: this.m_objI18NPipe.transform("女士[女士]"),
                    handler: () => {
                        this.m_objMebInfo.sex = 2;
                        this.m_objMebInfo.sexName = this.m_objI18NPipe.transform("女士[女士]");
                    }
                }
            ]
        });
        actionSheet.present();
    }
    //显示密码开关
    toggleShowTextPassword(): void {
        this.m_bEye = !this.m_bEye;
        !this.m_bEye ? this.m_sPasswordType = "text" : this.m_sPasswordType = "password";
    }
    //验证姓名与密码是否为空
    verification(): void {
        if (getSessionData('pq_PageJump') != PageJump.ForgetLoginPassword) {
            if (this.m_objMebInfo.mebName != "") this.m_bRegister = false;
        }
        if (this.m_objMebInfo.password != "") this.m_bRegister = false;
    }
    //注册
    register(): void {
        if (this.passwordVerification()) return;
        this.m_objContextService.loadingCreate();
        this.m_objApiUrl.register(getSessionData("msgToMsgNext").sCode, this.m_objMebInfo).subscribe(u => {
            this.sendApiReturn(u,this.m_objI18NPipe.transform("注册成功[注册成功]"));
        });
    }
    //重置登录密码
    resetLoginPassword(): void {
        if (this.passwordVerification()) return;
        this.m_objContextService.loadingCreate();
        this.m_objApiUrl.resetPwdBySMSCode(getSessionData("msgToMsgNext").sMobile, getSessionData("msgToMsgNext").sCode, this.m_objMebInfo.password).subscribe(u => {
            this.sendApiReturn(u, this.m_objI18NPipe.transform("密码修改成功[密码修改成功]"));
        });
    }
    //判断密码格式
    passwordVerification(): boolean {
        if (this.m_objMebInfo.password.length < 6) {
            this.m_objAlertService.tipsAlert(this.m_objI18NPipe.transform('密码长度不能小于6位[密码长度不能小于6位]'));
            return true;
        }else if (this.m_objMebInfo.password.length >= 20) {
            this.m_objAlertService.tipsAlert(this.m_objI18NPipe.transform('密码长度不能大于20位[密码长度不能大于20位]'));
            return true;
        }
        return false;
    }
    //发送api请求后返回值判断
    sendApiReturn(u: any,alertText: string): void {
        this.m_objContextService.loadingClose();
        if (u.Code == ErrorEnum.successfully) {
            this.m_objAlertService.tipsAlert(alertText, () => {
                //this.m_objNavCtrl.push("LoginPage");
                //this.m_objModalCtrl.create("LoginPage").present();
                this.m_objApp.getRootNav().push("LoginPage");
            });
        } else {
            this.m_objAlertService.tipsAlert(u.Msg);
        }
    }
}
