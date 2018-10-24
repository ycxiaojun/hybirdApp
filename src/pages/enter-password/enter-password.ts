import { Component, ViewChild,OnInit } from '@angular/core';
import { IonicPage, NavParams, ViewController, ModalController } from 'ionic-angular';
import { ThemeService } from '../../service/theme.service';
import { ContextService } from '../../service/context.service';
import { RoomFolio } from '../../frontofficedataclass/roomfolio';
import { ApiurlService } from '../../service/apiurl.service';
import { ErrorEnum } from '../../model/enumclasses';
import { AlertService } from '../../service/alert.service';
import { I18NPipe } from '../../pipe/I18NPipe';

@IonicPage()
@Component({
  selector: 'page-enter-password',
  templateUrl: 'enter-password.html',
})
export class EnterPasswordPage {
    m_objOrderDetails: RoomFolio = this.m_objNavParams.get("m_objOrderDetails");
    m_sPassword: string = "";
    @ViewChild("myInput") input;
    constructor(
        private m_objNavParams: NavParams,
        private m_objThemeService: ThemeService,
        private m_objViewCtrl: ViewController,
        private m_objContextService: ContextService,
        private m_objApiUrl: ApiurlService,
        private m_objAlertService: AlertService,
        private m_objModalCtrl:ModalController,
        private m_objI18NPipe:I18NPipe
    ) {
		
    }
    ngOnInit() {
        setTimeout(() => {
            this.input.nativeElement.focus();
        },500)
    }
    back(): void {
        this.m_objViewCtrl.dismiss();
    }
    pay(): void {
        if (this.m_sPassword != "") {
            this.m_objContextService.loadingCreate();
			//如果有使用优惠券
            if (this.m_objContextService.m_bIsUsedCoupon) {
                this.m_objApiUrl.onLinePayForDisCount(this.m_objOrderDetails.ChainID, Number(this.m_objOrderDetails.FolioID), this.m_objContextService.m_lsCouponCode).subscribe(data => {
                    if (data.Code == ErrorEnum.successfully) {
                        let actualAmount = (this.m_objOrderDetails.RoomRate * this.m_objOrderDetails.RoomCount * Number(this.m_objOrderDetails.NightCount)) - Number(data.Data);
                        this.payFn(actualAmount);
                    } else {
                        this.m_objAlertService.tipsAlert(data.Msg);
                    }
                })
            } else {
                //计算支付总额
                let actualAmount = (this.m_objOrderDetails.RoomRate * this.m_objOrderDetails.RoomCount * Number(this.m_objOrderDetails.NightCount)) - this.m_objContextService.m_nDiscountAmount;
                this.payFn(actualAmount);
            }
        } else {
            this.m_objAlertService.tipsAlert(this.m_objI18NPipe.transform("支付密码不能为空哦[支付密码不能为空哦]"));
        }
    }
    payFn(actualAmount): void {
        this.m_objApiUrl.onLinePayForStoreBalance(this.m_objOrderDetails.ChainID, Number(this.m_objOrderDetails.FolioID), actualAmount, this.m_sPassword).subscribe(data => {
            this.m_objContextService.loadingClose();
            switch (data.Code) {
                case ErrorEnum.successfully:
                    this.jumpPage(this.m_objI18NPipe.transform("订单支付成功！[订单支付成功]"));
                    break;
                case -10029:
                    this.jumpPage(this.m_objI18NPipe.transform("支付密码错误！[支付密码错误]"), true);
                    break;
                case -10030:
                    this.jumpPage(this.m_objI18NPipe.transform("储值余额不足！[储值余额不足]"));
                    break;
                case -10026:
                    this.jumpPage(this.m_objI18NPipe.transform("订单当前状态无法支付！[订单当前状态无法支付]"));
                    break;
                case -10027:
                    this.jumpPage(this.m_objI18NPipe.transform("当前订单非预定订单！[当前订单非预定订单]"));
                    break;
                default:
                    this.jumpPage(this.m_objI18NPipe.transform("支付失败，请重试！[支付失败，请重试]"));
            }
        })
    }
    jumpPage(msg,callback?:any):void {
        this.m_objAlertService.tipsAlert(msg, () => {
            if (!callback) {
                this.m_objModalCtrl.create("OrderPage").present();
                this.m_objViewCtrl.dismiss();
            }
            if (callback) {
                this.m_sPassword = "";
                setTimeout(() => {
                    this.input.nativeElement.focus();
                },500)
            }
        });
    }
}
