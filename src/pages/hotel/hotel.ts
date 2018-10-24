import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App, AlertController, ViewController } from 'ionic-angular';
import { ContextService } from '../../service/context.service';
import { ApiurlService } from '../../service/apiurl.service';
import { RoomType } from '../../frontofficedataclass/roomtype';
import { MyDateService } from '../../service/myDate.service';
import { AlertService } from '../../service/alert.service';
import { ThemeService } from '../../service/theme.service';
import { ChainRoomService } from '../../centerdataclass/ChainRoomService';
import { onLineBookApiNew } from '../../config/apiurl';
import { HotelInfoService } from '../../service/hotelInfo.service';
import { setSessionData, getSessionData, removeSessionData, getLocalData } from '../../util/util';
import { I18NPipe } from '../../pipe/I18NPipe';

@IonicPage()
@Component({
    selector: 'page-hotel',
    templateUrl: 'hotel.html',
})
export class HotelPage{

    m_nHotelId: number;  //酒店ID
    m_sCheckInDate: string;  //入住日期
    m_sCheckOutDate: string;  //离店日期
    m_sBrandName: string;  //酒店品牌
    m_sAddress: any;  //酒店地址
    m_sChainName: string;  //酒店名称
	m_nCommentScore: number;  //评分
	m_nStarNumber: number;  //星星数量
	m_nCommentCount: number;  //评论数量
    m_objRoomTypes: RoomType[] = []; //房型列表
    m_nMebRoomRateTypeId: number;  //会员价格类型
	m_nNightCount: number;  //房晚
	m_nPageIndex: number = 1;  //分页页码
    m_nPageSize: number = 5;  //每页数量
    m_sMapUrl: string;  //酒店定位URL
    // m_lsChainIdList: Array<any> = [1,2,3];  
    m_objChainRoomServiceInfo: ChainRoomService;
    m_sApiUrl:string = onLineBookApiNew;
    m_bIsReservation = false;
    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        public m_objContextService: ContextService,
        public apiUrl: ApiurlService,
        public modalCtrl: ModalController,
        public m_objMyDateService: MyDateService,
        private m_objApp: App,
        public m_objAlert: AlertService,
        public alertCtrl: AlertController,
        public m_objThemeService: ThemeService,
        public m_objHotelInfoService: HotelInfoService,
        private m_objViewCtrl:ViewController,
        private m_objI18NPipe:I18NPipe
    ) {
        this.getNavParams();
    }

    ionViewDidLoad() {
        this.m_bIsReservation = getSessionData("m_bIsReservation") != null;
		this.getRoomTypeDetails();
        this.getHotelComment();
    }
    //离开页面时触发
    ionViewWillLeave(){
        //每次离开页面是否-->清空长租选择房型
        removeSessionData("m_bIsReservation");
        this.m_bIsReservation = false;
    }
    // 获取上个页面传递过来的参数
    getNavParams(): void {
        let hotelDetailsParams = JSON.parse(sessionStorage.getItem('hotelDetailsParams'));
        this.m_nHotelId = hotelDetailsParams.hotelId;
        this.m_sCheckInDate = hotelDetailsParams.arrive;
        this.m_sCheckOutDate = hotelDetailsParams.depart;
    }

	//获取评论
	private getHotelComment(): void {
        this.apiUrl.getHotelComment(this.m_nHotelId, 0, this.m_nPageSize, this.m_nPageIndex, 0).subscribe(u => {
			this.m_nCommentCount = u.Data.RowCount;
        })
    }

    // 日期选择页面
    private goDatePicker() :void{
        this.navCtrl.push('DatePickerPage');
    }

    // 获取房型信息
    private getRoomTypeDetails(): void{
        //如果这个存在则证明长租选择房型，获取缓存加载列表
        if(!this.m_bIsReservation){
            this.getRoomTypeDetailFn();
        }else{
            if(!getLocalData("[roomTypeDetails]")){
                this.getRoomTypeDetailFn();
            }else{
                this.m_objRoomTypes = getSessionData("m_objRoomTypes");
            }
            
        }
    }
    //获取房型信息封装
    private getRoomTypeDetailFn():void{
        this.m_objContextService.loadingCreate();
        this.apiUrl.getRoomTypeDetail(this.m_nHotelId,this.m_sCheckInDate,this.m_sCheckOutDate).subscribe(u => {
            this.m_objContextService.loadingClose();
            localStorage["[roomTypeDetails]"] = JSON.stringify(u);
            this.m_sBrandName = u.Data.Chain.BrandName;
            this.m_sChainName = u.Data.Chain.ChainName;
            this.m_sAddress = u.Data.Chain.ChainAddress;
            this.m_nCommentScore = Number(((u.Data.CommentScore / 100) * 5).toFixed(1));
            this.m_nStarNumber = u.Data.CommentScore;
            this.m_objRoomTypes = u.Data.RoomTypes;
            this.m_nNightCount = u.Data.NightCount;
            this.m_sMapUrl = u.Data.AttachedInfo.BaiduMapUrl;
            this.m_objRoomTypes.forEach(s => {
                s.RoomAvailable = s.RoomTypeItem.RoomCount - s.RoomTypeItem.BookInCount - s.RoomTypeItem.CheckInCount - s.RoomTypeItem.StopSaleCount;
            });
            this.m_objRoomTypes.forEach(item => {
                item.RoomRateItems.forEach(s => {
                    if (s.RoomRateTypeID == 1) {
                        item.RetailPrice = s.RoomRate;
                    }
                })
            })
            this.getMebRoomRateTypeId();
            console.log(this.m_objRoomTypes);
        })
    }
    // 获取用户价格类型ID
    private getMebRoomRateTypeId():void{
        this.apiUrl.getMebRoomRateType(this.m_nHotelId).subscribe(u => {
            this.m_nMebRoomRateTypeId = u.Data.RoomRateTypeID;
            this.m_objRoomTypes.forEach(item => {
                item.RoomRateItems.forEach(r => {
                    if (r.RoomRateTypeID == this.m_nMebRoomRateTypeId){
                        item.MebRoomRate = r.RoomRate;
                        item.AccDate = r.AccDate.toString();
                        item.MebRoomPriceName = r.RoomRateTypeName;
                    }
                })
            })
            this.m_objRoomTypes.sort(this.sortByPrice).reverse();
            localStorage['[RoomTypes]'] = JSON.stringify(this.m_objRoomTypes);
        })
    }

    // 价格排序（升序）
    private sortByPrice(a:any, b:any):any{
        return b.MebRoomRate - a.MebRoomRate;
    }

    // 导航至酒店地图页
    private goHotelMap():void{
        this.m_objApp.getRootNav().push('MapPage',{
            mapUrl: this.m_sMapUrl,
            brandName: this.m_sBrandName,
            chainName: this.m_sChainName,
            address: this.m_sAddress
        });
        // window.location.href = this.m_sMapUrl;
    }

    // 导航至酒店详情页
    private goHotelDetails():void{
        this.navCtrl.push('HotelDetailsPage');
    }

    // 导航至酒店评论页
    private goHotelComment(): void{
        this.m_objApp.getRootNav().push('HotelCommentPage', {
            hotelId: this.m_nHotelId
        });
    }

    // 房型列表Item点击事件
    private roomTypeItemClickEv (type: number, index: number, item: any) {
        if (type === 3) {
            this.goSubmitOrder(item.RoomTypeID, item.RoomTypeName, item.AccDate);
        } else if (type === 2) {
            this.goLogin();
        } else {
            this.openRoomDetails(item.RoomTypeID, index, item.RoomTypeName);
        }
        event.stopPropagation();
    }

    // 打开房型详情描述模态框
    private openRoomDetails(roomTypeId:number, index:number, roomTypeName:string):void{
        //第二次进入选择预约房型时不触发房间详情
        if(!this.m_bIsReservation){
            localStorage['[RoomTypes]'] = JSON.stringify(this.m_objRoomTypes);
            setSessionData("m_bIsReservationCopy",true)
            this.m_objContextService.m_bRoomDetailsMask = true;
            let roomDetailsModal = this.modalCtrl.create("ModalRoomDetailsPage", {
                roomTypeId: roomTypeId,
                hotelId: this.m_nHotelId,
                index: index,
                roomTypeName: roomTypeName
            },{
                showBackdrop: false
            }).present();
        }
    }

    // 导航至提交订单页面
    private goSubmitOrder(roomTypeId:number, typeName: string, accDate: string){
        if(this.m_objContextService.isLogin()){
            this.m_objApp.getRootNav().push('SubmitOrderPage', {
                roomTypeId: roomTypeId,
                roomTypeName: typeName,
                hotelId: this.m_nHotelId,
                accDate: accDate
            });
        }else{
            this.m_objAlert.tipsAlert(this.m_objI18NPipe.transform('您还未登录！[您还未登录！]'),() => {
                this.goLogin();
            })
        }
    }

    // 导航至登录页
    private goLogin(){
        this.navCtrl.push('LoginPage');
		setSessionData("source", 'HotelPage')
    }

    //预约看房
    private goReservantion(nRoomTypeID:number, sRoomTypeName:string):void{
        //存储房间列表，预定页面选择使用
        setSessionData('m_objRoomTypes',this.m_objRoomTypes);
        //预约看房房型放在上下文
        this.randListPush(nRoomTypeID,sRoomTypeName);
    }
    //选择多个预约看房房型(第二次进来)
    private selectReservationRoomType(nRoomTypeID:number, sRoomTypeName:string):void{
        //预约看房房型放在上下文
        this.randListPush(nRoomTypeID,sRoomTypeName);
        
    }
    //预约看房房型放在上下文
    private randListPush(nRoomTypeID:number, sRoomTypeName:string):void{
        let bHaveRoomTypeID = false;
        for(let list of this.m_objContextService.m_objRandList){
            //循环判断数组中是否存在一样的房间类型
            //如果数组中没有则追加进上下文
            if(list.roomTypeID == nRoomTypeID){
                bHaveRoomTypeID = true;
                break;
            }
        }
        if(!bHaveRoomTypeID){
            this.m_objContextService.m_objRandList.push({
                roomTypeName:sRoomTypeName,
                roomTypeID:nRoomTypeID
            })
            //是第二次进入列表选择才触发返回
            if(this.m_bIsReservation){
                this.navCtrl.pop();
            }else{
                this.navCtrl.push('ReservationPage');
            }
        }else{
            this.m_objAlert.tipsAlert(this.m_objI18NPipe.transform("该房型已在预约列表，请重新选择[该房型已在预约列表，请重新选择]"));
        }
    }
    //返回上一页
    back():void{
        this.m_objViewCtrl.dismiss();
    }
}