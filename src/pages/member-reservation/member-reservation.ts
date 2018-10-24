import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { ErrorEnum } from '../../model/enumclasses';
import { ApiurlService } from '../../service/apiurl.service';
import { ThemeService } from '../../service/theme.service';
import { AlertService } from '../../service/alert.service';
import { ContextService } from '../../service/context.service';
import { GetBookShowRoomList } from '../../frontofficedataclass/getbookshowroomlist';
import { BookShowRoomList } from '../../frontofficedataclass/bookshowroomlist';
import { setSessionData, getToday } from '../../util/util';
import { I18NPipe } from '../../pipe/I18NPipe';

@IonicPage()
@Component({
  selector: 'page-member-reservation',
  templateUrl: 'member-reservation.html',
})
export class MemberReservationPage {
  //每页有多少条数据
  m_nPageSize: number = 20;
  //页码
  m_nPageNo: number = 1;
  //是否可以下拉刷新列表
  m_bRefreshList: boolean = true;
  //页码总数
  m_nPageCount: number = 1;
  //是否拥有更多数据（可否下拉加载）
  m_bHaveMoreData = false;
  //预定列表搜索条件
  m_objCondition: GetBookShowRoomList = new GetBookShowRoomList();
  //预约列表
  m_lsBookShowRoomList: BookShowRoomList[] = [];
  //当日日期
  m_sDate:any = getToday();
  constructor(
    private m_objApiUrlService: ApiurlService,
    private m_objThemeService: ThemeService,
    private m_objAlertService: AlertService,
    private m_objContextService: ContextService,
    private m_objNavCtrl:NavController,
    private m_objI18NPipe:I18NPipe
  ) {
    if (this.m_objContextService.isLogin()) {
      this.m_objContextService.loadingCreate();
      this.queryBookShowRoom(this.m_nPageSize, this.m_nPageNo);
    };
  }

  //获取订单列表
  queryBookShowRoom(nPageSize: number, nPageNo: number, fn?:any): void {
    this.m_objApiUrlService.queryBookShowRoom(nPageSize, nPageNo, this.m_objCondition).subscribe(data => {
      this.m_objContextService.loadingClose();
      //数据获取成功
      if (data.Code == ErrorEnum.successfully) {
        //总数不为0
        if (data.Data.RowCount != 0) {
          if(nPageNo = 0){
            this.m_lsBookShowRoomList = data.Data.DataSet;
          }else{
            //返回数据的数组长度
            let nDataLen = data.Data.DataSet.length;
            for(let i=0;i<nDataLen;i++){
              //追加进当前列表
              this.m_lsBookShowRoomList.push(data.Data.DataSet[i]);
            }
          }
          this.m_nPageCount = data.Data.PageCount;
          this.m_bRefreshList = true;
          if (data.Data.PageNo >= data.Data.PageCount) this.m_bHaveMoreData = true;
        }
      }
      //回调函数
      if(fn) fn();
    })
  }
  //滚动加载
  doInfinite(): Promise<any> {
    return new Promise((resolve) => {
      if (this.m_bRefreshList) {
        this.m_bRefreshList = false;
        this.queryBookShowRoom(this.m_nPageSize, ++this.m_nPageNo, () => {
          resolve();
        });
      }
    })
  }
  //获取订单状态中文
  parseStateText(nBookShowRoomStatus:number): string {
    switch (nBookShowRoomStatus){
      case 1:
        return this.m_objI18NPipe.transform('预约成功[预约成功]');
      case 4:
        return this.m_objI18NPipe.transform('已取消[已取消]');
      default:
        return '';
    }
  }
  //取消预约
  cancelBookShowRoom(nBookShowRoomID: number): void {
    let index = 0;
    this.m_objAlertService.yesNoButtonTipsAlert(this.m_objI18NPipe.transform("您确定要取消该预约吗[您确定要取消该预约吗]?"), () => {
      this.m_objContextService.loadingCreate();
      this.m_objApiUrlService.cancelBookShowRoom(nBookShowRoomID).subscribe(data => {
        this.m_objContextService.loadingClose();
        if (data.Code == ErrorEnum.successfully) {
          this.m_nPageNo = 1;
          this.queryBookShowRoom(this.m_nPageSize, this.m_nPageNo);
          this.m_objAlertService.tipsToast(this.m_objI18NPipe.transform("订单取消成功[订单取消成功]!"), "top");
        } else {
          this.m_objAlertService.tipsToast(data.Data, "top");
        }
      });
    })
  }
  changeBookShowRoom(nBookShowRoomID: number,nHotelID:number):void{
    //需要用这个设置本地缓存，以此来获取酒店列表   this.m_sDate.year + "-" + this.m_sDate.month + "-" + this.m_sDate.day
    let HotelDetailsParams = {
      hotelId: nHotelID,
      arrive: "2018-10-18",
      depart: "2018-10-19",
    }
    setSessionData('hotelDetailsParams', HotelDetailsParams)
    //根据这个判断ReservationPage是否进入编辑页面
    this.m_objNavCtrl.push('ReservationPage',{
      'nBookShowRoomID':nBookShowRoomID,
      'hotelId':nHotelID
    });
  }
}
