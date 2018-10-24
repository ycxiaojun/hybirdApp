import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { ThemeService } from '../../service/theme.service';
import { ApiurlService } from '../../service/apiurl.service';
import { ContextService } from '../../service/context.service';
import { MyDateService } from '../../service/myDate.service';
import { AlertService } from '../../service/alert.service';
import { ErrorEnum } from '../../model/enumclasses';
import { setSessionData, getLocalData, getToday } from '../../util/util';
import { AddBookShowRoom } from '../../frontofficedataclass/addbookshowroom';
import { PersonMember } from '../../centerdataclass/personmember';
import { GetBookShowRoomList } from '../../frontofficedataclass/getbookshowroomlist';
import { BookShowRoomList } from '../../frontofficedataclass/bookshowroomlist';
import { I18NPipe } from '../../pipe/I18NPipe';

@IonicPage()
@Component({
    selector: 'page-reservation',
    templateUrl: 'reservation.html',
})
export class ReservationPage {
    m_objMsg: { sMobile: string, sCode: string, sName } = {
        sMobile: "",
        sCode: "",
        sName: ""
    };
    m_bSMSButton: boolean = false;
    m_bSMSClick: boolean = true;
    m_sMobile: string;
    m_sSMSText: string = this.m_objI18NPipe.transform("发送验证码[发送验证码]");
    m_sSMSCode: string;
    m_objMebInfo: any;
    m_objRoomTypesDetails: any;
    m_objRoomTypes: any; 
    m_sChainName:string; //酒店名
    m_sBrandName:string;
    m_sChainAddress:string; //酒店地址
    m_nHotelId: number;  //酒店ID
    m_lstAddGuestFolio: Array<any> = [];
    m_objEvent = {
        month: '',
        timeStarts: '08:00',
        price: { lower: 0, upper: 5000 }
    }
    m_sDate: any;
    m_sShowRoomID:string;   //看房房单ID
    m_sCheckInDate:string; //入住日期
    m_sCheckOutDate:string; //离店日期
    //预约看房
    m_objAddBookShowRoom: AddBookShowRoom = new AddBookShowRoom();
    //需要编辑的看房ID
    m_nBookShowRoomID:number;
    //搜索条件
    m_objCondition:GetBookShowRoomList = new GetBookShowRoomList();
    constructor(
        private m_objNavCtrl: NavController,
        private m_objThemeService: ThemeService,
        private m_objApiUrl: ApiurlService,
        private m_objNavParams: NavParams,
        private m_objMyDateService: MyDateService,
        private m_objContextService: ContextService,
        private m_objAlert: AlertService,
        private m_objModalCtrl: ModalController,
        private m_objI18NPipe:I18NPipe
    ) {
        this.m_nHotelId = this.m_objNavParams.get('hotelId');
        this.getRoomData();
    }
    //进入该页面机制
    ionViewCanEnter(): boolean {
        return this.m_objContextService.isLogin();
    }
    //即将进入该页面
    ionViewWillEnter():void{
        this.m_sDate = getToday();
        this.m_sDate = this.m_sDate.year + "-" + this.m_sDate.month + "-" + this.m_sDate.day;
        this.m_objEvent.month = this.m_sDate;
        if(this.m_objNavParams.get("nBookShowRoomID")) {
            //執行加載動畫
            this.m_objContextService.loadingCreate();
            this.m_nBookShowRoomID = this.m_objNavParams.get("nBookShowRoomID");
            this.m_objCondition.bookShowRoomID = this.m_nBookShowRoomID;
            this.m_objApiUrl.queryBookShowRoom(1,1,this.m_objCondition).subscribe(u=>{
                if(ErrorEnum.successfully == u.Code){
                    let objData: BookShowRoomList = u.Data.DataSet[0];
                    //主要房型如果不为空，则推入数组
                    if(u.Data.DataSet[0].RoomTypeID != 0) this.m_objContextService.m_objRandList.push({
                        "roomTypeID": objData.RoomTypeID,
                        "roomTypeName": objData.RoomTypeName
                    });
                    let nLength:number = objData.OtherRoomTypeList.length;
                    //截取字符串并生成数组
                    let lsOtherRoomTypeList: any[] = objData.OtherRoomTypeList.split(",")
                    //循环其他预约酒店名
                    for (let i=0;i<nLength;i++) {
                        this.m_objContextService.m_objRandList.push({
                            "roomTypeID": lsOtherRoomTypeList[i] * 1,
                            "roomTypeName": objData.OtherRoomTypeList[i]
                        })
                    }
                    //加载预约房号
                    this.m_sShowRoomID = objData.OtherRoomNoList;
                    //获取当前日期
                    let objToday = new Date(this.m_sDate);
                    let objDate = new Date(objData.ShowRoomDate);
                    //加载看房日期,如果数据库日期早于当前日期则按数据库日期
                    if(objToday>objDate){
                        //将比较早的时间赋给最早可以看房的值
                        this.m_sDate = objDate.getFullYear() +"-"+ (objDate.getMonth() + 1) +"-"+ objDate.getDate();
                        this.m_objEvent.month = this.m_sDate;
                        let sTimer = objData.ShowRoomDate.toString().split("T")[1];
                        this.m_objEvent.timeStarts = sTimer;   //.substring(0,length - 3)删掉最后3个字符
                        console.log(this.m_objEvent.timeStarts)
                    }
                    //价格区间
                    //最低的价格
                    this.m_objEvent.price.lower = objData.PriceBegin;
                    //最高的价格
                    this.m_objEvent.price.upper = objData.PriceEnd;
                    //联系人
                    this.m_objAddBookShowRoom.contractName = objData.ContractName;
                    //联系人电话
                    this.m_objAddBookShowRoom.mobileNo = objData.MobileNo;
                    //备注
                    this.m_objAddBookShowRoom.bookRemark = objData.BookRemark;
                }
                //關閉加載動畫
                this.m_objContextService.loadingClose();
            })
        }
    }

    //获取数据
    getRoomData(): void {
        this.m_objMebInfo = JSON.parse(localStorage["m_objPersonMember"]);
        this.m_objAddBookShowRoom.contractName = this.m_objMebInfo.MebName;
        this.m_objAddBookShowRoom.mobileNo = this.m_objMebInfo.Mobile;
        //当前日期
        let objToday = getToday();
        //入住日期赋值
        this.m_sCheckInDate = objToday.year + "-" + objToday.month + "-" + objToday.day;
        //离店日期赋值
        this.m_sCheckOutDate = objToday.year + "-" + objToday.month + "-" + (objToday.day + 1);
        //获取房型列表
        this.m_objApiUrl.getRoomTypeDetail(this.m_nHotelId,this.m_sCheckInDate,this.m_sCheckOutDate).subscribe(u => {
            localStorage["[roomTypeDetails]"] = JSON.stringify(u);
            this.m_objRoomTypes = u.Data.RoomTypes;
            this.m_objRoomTypesDetails = u.Data;
            
            this.m_sBrandName = this.m_objRoomTypesDetails.Chain.BrandName;
            this.m_sChainName = this.m_objRoomTypesDetails.Chain.ChainName;
            this.m_sChainAddress = this.m_objRoomTypesDetails.Chain.ChainAddress;
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
        })
    }

    //删除已选中的房型
    removeRandList(nRoomTypeID: number): void {
        let nLength = this.m_objContextService.m_objRandList.length;
        //至少要选择一个房型
        if (nLength == 1) {
            this.m_objAlert.tipsAlert(this.m_objI18NPipe.transform('至少要保留一个房型哦[至少要保留一个房型哦]'));
            return;
        }
        for (let i = 0; i <= nLength; i++) {
            if (nRoomTypeID == this.m_objContextService.m_objRandList[i].roomTypeID) {
                this.m_objContextService.m_objRandList.splice(i, 1);
                break;
            }
        }
    }

    //跳转到选择房型页面
    goSelectRoomType(): void {
        setSessionData("m_bIsReservation", true)
        this.m_objModalCtrl.create('HotelPage').present();
    }

    //获取验证码
    getVerificationCode(): void {
        if (this.checkPhone()) {
            //发送验证码按钮变为不可用
            this.m_bSMSButton = true;
            //防止发送验证码后修改手机号可以再次发送验证码
            this.m_bSMSClick = false;
            //多久可以再次发送验证码
            let time = 61;
            //更改发送验证码文字
            this.m_sSMSText = (--time).toString();
            this.m_objApiUrl.sendSMSCode(this.m_objMsg.sMobile).subscribe(u => {
                if (u.Code == 0) {
                    //验证码
                    this.m_sSMSCode = u.Data;
                    this.m_objMsg.sCode = u.Data;
                    //验证发送验证码的手机号跟验证码是否一致
                    this.m_sMobile = this.m_objMsg.sMobile;
                    //定时器
                    var countdown = setInterval(() => {
                        //更改发送验证码文字
                        this.m_sSMSText = (--time).toString();
                        //倒计时结束时
                        if (time == 0) {
                            //发送验证码按钮变为可用
                            this.m_bSMSButton = false;
                            this.m_bSMSClick = true;
                            this.m_sSMSText = "发送验证码";
                            //清除定时器
                            clearInterval(countdown);
                        };
                    }, 1000)
                }
            })
        }
    }

    // 日期选择页面
    private goDatePicker(): void {
        this.m_objNavCtrl.push('DatePickerPage');
    }

    checkName() {
        if (this.m_objAddBookShowRoom.contractName == "") {
            this.m_objAlert.tipsAlert('请输入预定人姓名！');
        } else {
            // this.checkPhone();
            return true;
        }
    }

    checkPhone() {
        if (this.m_objAddBookShowRoom.mobileNo == "") {
            this.m_objAlert.tipsAlert('请输入预定人联系方式！');
        } else {
            // this.checkCode();
            return true;
        }
    }

    checkCode() {
        if (this.m_objMsg.sCode != "" && this.m_objMsg.sCode != null) {
            if (this.m_objMsg.sCode == this.m_sSMSCode) {
                return true;
            } else {
                this.m_objAlert.tipsAlert('验证码不匹配!');
            }
        } else {
            this.m_objAlert.tipsAlert('验证码不能为空!');
        }
    }

    //提交订单
    bookIn() {
        // if(this.checkName()&&this.checkPhone()&&this.checkCode())
        if (this.checkName() && this.checkPhone()) {
            //预约房型数组不能为空
            if (this.m_objContextService.m_objRandList.length > 0) {
                //執行加載動畫
                this.m_objContextService.loadingCreate();
                let objPersonMember: PersonMember = new PersonMember();
                objPersonMember = getLocalData("m_objPersonMember")
                this.m_objAddBookShowRoom.chainID = this.m_objRoomTypesDetails.Chain.ChainID;
                this.m_objAddBookShowRoom.mebID = objPersonMember.MebID;
                this.m_objAddBookShowRoom.mobileNo = objPersonMember.Mobile;
                this.m_objAddBookShowRoom.docTypeID = objPersonMember.DocType;
                this.m_objAddBookShowRoom.docNo = objPersonMember.DocNo;
                this.m_objAddBookShowRoom.sexID = objPersonMember.Sex;
                //预约房型
                this.m_objAddBookShowRoom.roomTypeID = this.m_objContextService.m_objRandList[0].roomTypeID;
                //房间分类ID列表
                let sRoomTypeIDList: any = '';
                //房间类型总数
                let nRoomTypeListLength: number = this.m_objContextService.m_objRandList.length;
                //for循环的次数
                let nIndex: number = 0;
                for (let list of this.m_objContextService.m_objRandList) {
                    nIndex++;
                    if (nIndex == 1) continue;
                    sRoomTypeIDList += list.roomTypeID;
                    if (nIndex < nRoomTypeListLength) sRoomTypeIDList += ",";
                }
                //其他房型列表
                if(sRoomTypeIDList == "") sRoomTypeIDList = [];
                    this.m_objAddBookShowRoom.otherRoomTypeList = sRoomTypeIDList;
                //其他房号ID列表
                    this.m_objAddBookShowRoom.otherRoomNoList = this.m_sShowRoomID;
                    //房号ID
                    this.m_objAddBookShowRoom.roomNo = 0;
                    this.m_objAddBookShowRoom.statusRemark = "";
                    //最低价格
                    this.m_objAddBookShowRoom.priceBegin = this.m_objEvent.price.lower;
                    //最高价格
                    this.m_objAddBookShowRoom.priceEnd = this.m_objEvent.price.upper;
                    //预约看房时间
                    this.m_objAddBookShowRoom.showRoomDate = new Date(this.m_objEvent.month + " " + this.m_objEvent.timeStarts);
                    //console.log(this.m_objAddBookShowRoom);
                    if(!this.m_nBookShowRoomID){
                        //执行提交
                        this.m_objApiUrl.addBookShowRoom(this.m_objAddBookShowRoom).subscribe(u => {
                            this.m_objContextService.loadingClose();
                            if (u.Code == ErrorEnum.successfully) {
                                this.m_objAlert.tipsAlert('订单提交成功!', () => {
                                    this.m_objNavCtrl.pop();
                                    this.m_objContextService.m_objRandList = [];
                                });
                            } else {
                                this.m_objAlert.tipsAlert(u.Msg);
                            }
                        })
                    }else{
                        this.m_objAddBookShowRoom.bookShowRoomID = this.m_nBookShowRoomID;
                        //执行更新
                        this.m_objApiUrl.updateBookShowRoom(this.m_objAddBookShowRoom).subscribe(u=>{
                            this.m_objContextService.loadingClose();
                            if(ErrorEnum.successfully == u.Code){
                                this.m_objAlert.tipsAlert('订单提交成功!', () => {
                                    this.m_objNavCtrl.pop();
                                    this.m_objContextService.m_objRandList = [];
                                });
                            } else {
                                this.m_objAlert.tipsAlert(u.Msg);
                            }
                        })
                    }
                } else {
                    this.m_objAlert.tipsAlert('至少要选择一个房型哦~');
                }
        }
    }
}

class personalList {
    name: string;
    phone: string;

    constructor(name: string, phone: string) {
        this.name = name;
        this.phone = phone;
    }

}
