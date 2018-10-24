import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ActionSheetController } from 'ionic-angular';
import { getSessionData } from '../../util/util';
import { RoomFolio } from '../../frontofficedataclass/roomfolio';
import { ThemeService } from '../../service/theme.service';
import { ApiurlService } from '../../service/apiurl.service';
import { ErrorEnum } from '../../model/enumclasses';
import { AlertService } from '../../service/alert.service';
import { ContextService } from '../../service/context.service';
import { setSessionData } from '../../util/util';
import { I18NPipe } from '../../pipe/I18NPipe';

@IonicPage()
@Component({
    selector: 'page-details',
    templateUrl: 'details.html',
})
export class DetailsPage {

    m_objOrderDetails: RoomFolio = new RoomFolio();
    m_bToPay: boolean = false;
    m_bCancelOrder: boolean = false;
    m_bCancelAndPayBox: boolean = false;
	m_sPayState: string;
	m_nRefType: number = getSessionData('source'); //获取跳转源类型（0:从创建订单页过来，1:从订单列表页过来）
	m_nFolioId: number = getSessionData('folioId');
	m_lsPhone: Array<string>;
    constructor(
        private m_objThemeService: ThemeService,
        private m_objApiUrlService: ApiurlService,
        private m_objAlertService: AlertService,
        private m_objNavCtrl: NavController,
		private m_objContextService: ContextService,
		private m_objActionSheetCtrl: ActionSheetController,
        private m_objI18NPipe:I18NPipe
    ) {
        if(getSessionData("m_objOrderDetails") != '' && getSessionData("m_objOrderDetails") != null){
			this.m_objOrderDetails = getSessionData("m_objOrderDetails");
			this.m_lsPhone = this.m_objOrderDetails.ChainTel.replace("-", "").split("/");
        }else{
            this.m_objApiUrlService.getOrder(this.m_nFolioId).subscribe(data => {
                this.m_objOrderDetails = data.Data;
                if (data.Code == ErrorEnum.successfully) {
                    setSessionData("m_objOrderDetails", data.Data);
                }
            });
        }
        //判断是否显示支付
        this.payAble(this.m_objOrderDetails.PayTransState, this.m_objOrderDetails.FolioState+1);
		//判断是否显示支付与取消按钮
        let time = setInterval(() => {
            if (this.m_objOrderDetails) {
                if (this.m_objOrderDetails.FolioState + 1 == 3) this.m_bCancelOrder = false;
                if (this.m_objOrderDetails.PayTransState != 3 && this.m_objOrderDetails.FolioState == 0) this.m_bCancelAndPayBox = true;
                    clearInterval(time);
            }
        }, 100)
    }
    //获取订单状态中文
    parseStateText(State, PayTransState): string {
        let stateText = "";
        State += 1;
        switch (State) {
            case 1: stateText = this.m_objI18NPipe.transform("预订[预订]"); break;
            case 2: stateText =  this.m_objI18NPipe.transform("取消[取消]"); break;
            case 3: stateText =  this.m_objI18NPipe.transform("未到[未到]"); break; //给了钱到了入住时间没有去入住的
            case 4: stateText =  this.m_objI18NPipe.transform("入住[入住]"); break;
            case 5: stateText =  this.m_objI18NPipe.transform("退房[退房]"); break;
            default: return  this.m_objI18NPipe.transform('未知[未知]');
        }
        if (State == 1 && PayTransState == 3) stateText +=  this.m_objI18NPipe.transform(" 已支付[已支付]");
        return stateText;
    }
    //判断是否显示支付
    payAble(payState, state): void {
        if (state == 1) {
            if (payState == 3) {
                this.m_bToPay = false;
                this.m_bCancelOrder = true;
                this.m_sPayState =  this.m_objI18NPipe.transform("已支付[已支付]");
            } else {
                this.m_bToPay = true;
                this.m_bCancelOrder = false;
                this.m_sPayState =  this.m_objI18NPipe.transform("未支付[未支付]");
            }
        } else {
            this.m_bToPay = false;
            this.m_bCancelOrder = false;
            if (payState == 3) this.m_sPayState = this.m_objI18NPipe.transform("已支付[已支付]");
        }
    }
    //取消订单
    orderCancle(nHotelID, nFolioID): void {
        this.m_objAlertService.yesNoButtonTipsAlert( this.m_objI18NPipe.transform("您确定要取消该订单吗？[您确定要取消该订单吗]"), () => {
            this.m_objContextService.loadingCreate();
            this.m_objApiUrlService.orderCancle(nHotelID, nFolioID).subscribe(data => {
                if (data.Code == ErrorEnum.successfully) {
                    this.m_objAlertService.tipsAlert(this.m_objI18NPipe.transform("取消订单成功[取消订单成功]"), () => {
                        if (this.m_nRefType == 1) {
                            this.m_objNavCtrl.pop();
                        }
                    });
                } else {
                    this.m_objAlertService.tipsAlert(data.Msg);
                }
                this.m_objContextService.loadingClose();
            })
        })
    }
	//拨打电话
	callPhone(): void {
		var arr = [];
		for (let i = 0; i < this.m_lsPhone.length; i++) {
			arr[i] = {
				text: this.m_lsPhone[i],
				handler: () => {
					window.location.href = "tel:" + this.m_lsPhone[i].replace("-", "");
				}
			}
		}
		this.m_objActionSheetCtrl.create({
			title: "",
			buttons: arr

		}).present();
	}
	//发送订单到邮箱
	sendEmail():void {

	}
	//酒店地图
	//goHotelMap(): void {
	//	this.m_objApp.getRootNav().push('MapPage', {
	//		mapUrl: this.m_objHotelAttachedInfo.BaiduMapUrl,
	//		brandName: this.m_objChainInfo.BrandName,
	//		chainName: this.m_objChainInfo.ChainName,
	//		address: this.m_objChainInfo.ChainAddress
	//	});
	//}

	goPay() {
		setSessionData("folioId", this.m_nFolioId);
        this.m_objNavCtrl.push('PaymentPage');
    }
}
