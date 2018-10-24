import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { api, EApi } from '../config/apiurl';
import { Result } from '../model/result';
import { HttpService } from '../http/http.service';
import { RegPersonMember } from '../class/RegPersonMember';
import { PersonMember } from '../centerdataclass/personmember';
import { DiscountCoupons } from '../centerdataclass/discountcoupons';
import { PageAbleList } from '../centerdataclass/pageablelist';
import { PointGatherInfo } from '../centerdataclass/pointgatherinfo';
import { StoreValueSummary } from '../centerdataclass/storevaluesummary';
import { Chain } from "../centerdataclass/chain"; 
import { GainPoint } from '../centerdataclass/gainpoint';
import { StoreValue } from '../centerdataclass/storevalue';
import { UsedPoint } from '../centerdataclass/usedpoint';
import { PresentStoreValue } from '../centerdataclass/presentstorevalue'; 
import { PresentStoreValueSummary } from '../centerdataclass/presentstorevaluesummary';
import { HotelDetailsItem } from "../model/hoteldetailsitem";
import { RoomFolio } from '../frontofficedataclass/roomfolio';
import { QueryHotelComment } from '../model/queryhotelcomment';
import {RoomRateMebType} from '../frontofficedataclass/roomratemebtype';
import {AddPersonBookFolio} from '../frontofficedataclass/addpersonbookfolio';
import {AddGuestFolio} from '../frontofficedataclass/addguestFolio';
import { BookInfo } from '../model/bookinfo'
import { FolioCommentResult } from '../centerdataclass/foliocommentresult';
import { ECouponsState } from '../centerdataclass/ecouponstate';
import { CompanyInfo } from '../centerdataclass/companyinfo';
import { FolioPayTrans } from '../frontofficedataclass/foliopaytrans';
import { PayForMidtrans } from '../frontofficedataclass/payformidtrans';
import { Theme } from '../frontofficedataclass/theme';
import { ChainRoomTypeRemark } from '../centerdataclass/ChainRoomTypeRemark';
import { GetFeatures } from '../centerdataclass/getfeatures';
import { AddBookShowRoom } from '../frontofficedataclass/addbookshowroom';
import { UpdateBookShowRoom } from '../frontofficedataclass/updatebookshowroom';
import { GetBookShowRoomList } from '../frontofficedataclass/getbookshowroomlist';
import { BookShowRoomList } from '../frontofficedataclass/bookshowroomlist';
import { AddMebRoomService, UpdateMemberRoomService, QueryMemberRoomService, QueryMemberRoomServiceResult } from '../class/MebRoomServiceClass';
import { EbDict } from "../class/EBDict";
import { MebFolioClass } from "../class/mebFolioClass";
import { MebFolio } from "../class/mebFolio";

@Injectable() 
export class ApiurlService {
    constructor(
        public m_objHttpService: HttpService,
    ) { }
    
    //分页查询用户房单
    queryMebFolio(nPageSize: number, nPageNo: number, objCondition: MebFolio): Observable<Result<PageAbleList<MebFolioClass>>>{
        var apiUrl = `${api(EApi.QueryMebFolio)}`;
        apiUrl+=`?nPageSize=${nPageSize}`;
        apiUrl+=`&nPageNo=${nPageNo}`;
        apiUrl+=`&objCondition=${JSON.stringify(objCondition)}`;
        return this.m_objHttpService.post<Result<PageAbleList<MebFolioClass>>>(apiUrl); 
    }

    //获取EB字典类型
    getEbDict(sCodeType: string): Observable<Result<EbDict[]>> {
        let apiUrl = `${api(EApi.GetEBDict)}`;
        apiUrl+=`?sCodeType=${sCodeType}`;
        return this.m_objHttpService.get<Result<EbDict[]>>(apiUrl);
    }

    //条件获取长租预约看房列表(分页)
    queryBookShowRoom(nPageSize:number,nPageNo:number,objCondition:GetBookShowRoomList): Observable<Result<PageAbleList<BookShowRoomList>>>{
        var apiUrl = `${api(EApi.queryBookShowRoom)}`;
        apiUrl+=`?nPageSize=${nPageSize}`;
        apiUrl+=`&nPageNo=${nPageNo}`;
        apiUrl+=`&objCondition=${JSON.stringify(objCondition)}`;
        return this.m_objHttpService.post<Result<PageAbleList<BookShowRoomList>>>(apiUrl); 
    }
    //获取长租预约看房列表
    getBookShowRoomList(objCondition:GetBookShowRoomList): Observable<Result<BookShowRoomList>>{
        var apiUrl = `${api(EApi.getBookShowRoomList)}`;
        apiUrl+=`?objCondition=${JSON.stringify(objCondition)}`;
        return this.m_objHttpService.get<Result<BookShowRoomList>>(apiUrl); 
    }
    //取消长租预约看房
    cancelBookShowRoom(nBookShowRoomID:number): Observable<Result<string>>{
        var apiUrl = `${api(EApi.cancelBookShowRoom)}`;
        apiUrl+=`?nBookShowRoomID=${nBookShowRoomID}`;
        apiUrl+='&nClientUserID=0';
        apiUrl+='&sClientUserName=0';
		return this.m_objHttpService.post<Result<string>>(apiUrl); 
    }
    //更新长租预约看房
    updateBookShowRoom(objUpdateBookShowRoom:UpdateBookShowRoom): Observable<Result<string>>{
        var apiUrl = `${api(EApi.updateBookShowRoom)}`;
        apiUrl+=`?objUpdateBookShowRoom=${JSON.stringify(objUpdateBookShowRoom)}`;
        apiUrl+='&nClientUserID=0';
        apiUrl+='&sClientUserName=0';
		return this.m_objHttpService.post<Result<string>>(apiUrl); 
    }
    //长租预约看房
    addBookShowRoom(objAddBookShowRoom:AddBookShowRoom): Observable<Result<string>>{
        var apiUrl = `${api(EApi.addBookShowRoom)}`;
        apiUrl+=`?objAddBookShowRoom=${JSON.stringify(objAddBookShowRoom)}`;
        apiUrl+='&nClientUserID=0';
        apiUrl+='&sClientUserName=0';
		return this.m_objHttpService.post<Result<string>>(apiUrl); 
    }
    //获取某个酒店房型详细信息
    getChainRoomTypeAttInfo(nChainID: number, nRoomTypeID: number): Observable<Result<ChainRoomTypeRemark>> {
        var apiUrl = `${api(EApi.getChainRoomTypeAttInfo)}`;
        apiUrl+=`?nChainID=${nChainID}`;
        apiUrl+=`&nRoomTypeID=${nRoomTypeID}`;
		return this.m_objHttpService.get<Result<ChainRoomTypeRemark>>(apiUrl); 
    }

	//获取功能列表（要显示的功能）
	getFeatures(): Observable<Result<GetFeatures>> {
		var apiUrl = `${api(EApi.getFeatures)}`;
		return this.m_objHttpService.get<Result<GetFeatures>>(apiUrl); 
	}
	//获取公司标记信息
    getCompanyMarkdownInfo(eRequestSource:number): Observable<Result<any>> {
        var apiUrl = `${api(EApi.getCompanyMarkdownInfo)}`;
        apiUrl += `?eRequestSource=${eRequestSource}`;
        return this.m_objHttpService.get<Result<any>>(apiUrl);
	}
	//获取支付记录 如果有优惠券使用记录 不能再使用优惠券
    getFolioPayTrans(nFolioID: number): Observable<Result<FolioPayTrans[]>> {
        var apiUrl = `${api(EApi.getFolioPayTrans)}`;
        apiUrl += `?nFolioID=${nFolioID}`;
        return this.m_objHttpService.get<Result<FolioPayTrans[]>>(apiUrl);
    }
	//绑定用户ID
    bindUserWithOpenID(sOpenID: string): Observable<Result<string>> {
        var apiUrl = `${api(EApi.bindUserWithOpenID)}`;
        apiUrl += `?sOpenID=${sOpenID}`;
        return this.m_objHttpService.post<Result<string>>(apiUrl);
    }
	//获取用户OpenID
    getOpenID(sCallbackURL:string): Observable<Result<any>> {
        var apiUrl = `${api(EApi.getOpenID)}`;
        apiUrl += `?sCallbackURL=${sCallbackURL}`;
        return this.m_objHttpService.get<Result<any>>(apiUrl);
    }
    //
    getCallback(url: string): Observable<Result<any>> {
        var apiUrl = url;
        return this.m_objHttpService.get<Result<any>>(apiUrl); 
    }

    //第三方支付
    onLinePayForMidtrans(nChainID: number, nFolioID: number, dmAmount: number): Observable<Result<PayForMidtrans>> {
        var apiUrl = `${api(EApi.onLinePayForMidtrans)}`;
        apiUrl += `?nChainID=${nChainID}`;
        apiUrl += `&nFolioID=${nFolioID}`;
        apiUrl += `&dmAmount=${dmAmount}`;
        return this.m_objHttpService.post<Result<PayForMidtrans>>(apiUrl);
    }
	//优惠券支付
    onLinePayForDisCount(nChainID: number, nFolioID: number, lsCouponCode:string[]): Observable<Result<string>> {
        var apiUrl = `${api(EApi.onLinePayForDisCount)}`;
        apiUrl += `?nChainID=${nChainID}`;
        apiUrl += `&nFolioID=${nFolioID}`;
        apiUrl += `&lsCouponCode=${JSON.stringify(lsCouponCode)}`;
        return this.m_objHttpService.post<Result<string>>(apiUrl);
    }
	//储值支付
    onLinePayForStoreBalance(nChainID: number, nFolioID: number, dmAmount: number, sPayPassword: string): Observable<Result<any>> {
        var apiUrl = `${api(EApi.onLinePayForStoreBalance)}`;
        apiUrl += `?nChainID=${nChainID}`;
        apiUrl += `&nFolioID=${nFolioID}`;
        apiUrl += `&dmAmount=${dmAmount}`;
        apiUrl += `&sPayPassword=${sPayPassword}`;
        return this.m_objHttpService.post<Result<any>>(apiUrl);
    }
	//微信支付
    onLinePayForWeChat(nChainID: number, nFolioID: number, dmAmount: number, sOpenID:string): Observable<Result<any>> {
        var apiUrl = `${api(EApi.onLinePayForWeChat)}`;
        apiUrl += `?nChainID=${nChainID}`;
        apiUrl += `&nFolioID=${nFolioID}`;
        apiUrl += `&dmAmount=${dmAmount}`;
        apiUrl += `&sOpenID=${sOpenID}`;
        return this.m_objHttpService.post<Result<string>>(apiUrl);
    }
	//设置当前语言
    setLanguage(eLanguage:number): Observable<Result<string>> {
        var apiUrl = `${api(EApi.setLanguage)}`;
        apiUrl += `?eLanguage=${eLanguage}`;
        return this.m_objHttpService.post<Result<string>>(apiUrl);
    }
	//获取当前语言
    getLanguage(): Observable<Result<string>> {
        var apiUrl = `${api(EApi.getLanguage)}`;
        return this.m_objHttpService.post<Result<string>>(apiUrl);
    }
    //获取当前主题
    getTheme(): Observable<Theme> {
        var apiUrl = `${api(EApi.getTheme)}`;
        return this.m_objHttpService.get<Theme>(apiUrl);
    }
    //设置当前主题
    setTheme(nTheme: Theme): Observable<Result<string>> {
        var apiUrl = `${api(EApi.setTheme)}`;
        apiUrl += `?nTheme=${JSON.stringify(nTheme)}`;
        return this.m_objHttpService.post<Result<string>>(apiUrl);
    }
	//获取公司简介
    getCompanyInfo(eRequestSource: number): Observable<Result<CompanyInfo>> {
        var apiUrl = `${api(EApi.getCompanyInfo)}`;
        apiUrl += `?eRequestSource=${eRequestSource}`;
        return this.m_objHttpService.get<Result<CompanyInfo>>(apiUrl);
    }
	//判断是否已经评论
    getCommentResult(lsFolioCommentResult: FolioCommentResult[]): Observable<Result<FolioCommentResult[]>> {
        var apiUrl = `${api(EApi.getCommentResult)}`;
        apiUrl += `?lsFolioCommentResult=${JSON.stringify(lsFolioCommentResult)}`;
        return this.m_objHttpService.get<Result<FolioCommentResult[]>>(apiUrl);
    }

	//更新头像
    uploadMebHeadImg(sFileToBase64: string): void {
        var sMebHeadImg: string = api(EApi.uploadMebHeadImg); 
        this.m_objHttpService.postByJq(sMebHeadImg, { 'sFileToBase64': sFileToBase64 });
    }
    //会员登录 
    login(sMobile: string, sPassword: string): Observable<Result<PersonMember>> {
        var apiUrl = `${api(EApi.login)}`;
        apiUrl += `?sMobile=${sMobile}`;
        apiUrl += `&sPassword=${sPassword}`;
        return this.m_objHttpService.post<Result<PersonMember>>(apiUrl);
    }
    //发送验证码
    sendSMSCode(sMobile: string): Observable<Result<string>> {
        var apiUrl = `${api(EApi.sendSMSCode)}`;
        apiUrl += `?sMobile=${sMobile}`;
        return this.m_objHttpService.get<Result<string>>(apiUrl);
    }
    //会员注册
    register(sSMSCode: string, objRegPersonMember: RegPersonMember): Observable<Result<PersonMember>> {
        var apiUrl = `${api(EApi.register)}`;
        apiUrl += `?sSMSCode=${sSMSCode}`;
        apiUrl += `&objRegPersonMember=${JSON.stringify(objRegPersonMember)}`;
        return this.m_objHttpService.post<Result<PersonMember>>(apiUrl);
    }
    //获取本地主题配置文件
    getThemeConfig(): Observable<any> {
        var apiUrl = `${api(EApi.getThemeConfig)}`;
        return this.m_objHttpService.get<Observable<any>>(apiUrl); 
    }
    //短信登录
    smsLogin(sMobile: string, sSMSCode: string): Observable<Result<PersonMember>> {
        var apiUrl = `${api(EApi.smsLogin)}`;
        apiUrl += `?sMobile=${sMobile}`;
        apiUrl += `&sSMSCode=${sSMSCode}`;
        return this.m_objHttpService.post<Result<PersonMember>>(apiUrl);
    }
    //忘记密码——重设登录密码
    resetPwdBySMSCode(sMobile: string, sSMSCode: string, sNewpsd:string): Observable<Result<PersonMember>> {
        var apiUrl = `${api(EApi.resetPwdBySMSCode)}`;
        apiUrl += `?sMobile=${sMobile}`;
        apiUrl += `&sSMSCode=${sSMSCode}`;
        apiUrl += `&sNewpsd=${sNewpsd}`;
        return this.m_objHttpService.post<Result<PersonMember>>(apiUrl);
    }
    //恢复登录
    recoverLogin(): Observable<Result<PersonMember>> {
        var apiUrl = `${api(EApi.recoverLogin)}`;
        return this.m_objHttpService.post<Result<PersonMember>>(apiUrl);
    }
    //获取城市列表
    getCityList(): Observable<Result<string>> {
        var apiUrl = `${api(EApi.getCity)}`;
        return this.m_objHttpService.get<Result<string>>(apiUrl);
    }
    //获取优惠券列表
    getCoupons(nPageSize: number, nPageNo: number, lsECouponsState: ECouponsState[]): Observable<Result<PageAbleList<DiscountCoupons>>> {
        var apiUrl = `${api(EApi.getCoupons)}`;
        apiUrl += `?lsECouponsState=${JSON.stringify(lsECouponsState)}`;
        apiUrl += `&nPageSize=${nPageSize}`;
        apiUrl += `&nPageNo=${nPageNo}`;
        return this.m_objHttpService.get<Result<PageAbleList<DiscountCoupons>>>(apiUrl);
    }
    //修改会员基本信息
    editMebInfo(objPersonMember: PersonMember): Observable<Result<string>> {
        var apiUrl = `${api(EApi.editMebInfo)}`;
        apiUrl += `?objPersonMember=${JSON.stringify(objPersonMember)}`;
        return this.m_objHttpService.post<Result<string>>(apiUrl);
    }
    //查询单条订单
    getOrder(nFolioID: number): Observable<Result<RoomFolio>> {
        var apiUrl = `${api(EApi.getOrder)}`;
        apiUrl += `?nFolioID=${nFolioID}`;
        return this.m_objHttpService.get<Result<RoomFolio>>(apiUrl);
    }
    //查询订单列表
    getOrders(nState: number, nPageSize: number, nPageNo: number): Observable<Result<PageAbleList<RoomFolio>>> {
        var apiUrl = `${api(EApi.getOrders)}`;
        apiUrl += `?nState=${nState}`;
        apiUrl += `&PageSize=${nPageSize}`;
        apiUrl += `&PageNo=${nPageNo}`;
        return this.m_objHttpService.get<Result<PageAbleList<RoomFolio>>>(apiUrl);
    }
    //退出登录
    loginOff(): Observable<Result<string>> {
        var apiUrl = `${api(EApi.loginOff)}`;
        return this.m_objHttpService.post<Result<string>>(apiUrl);
    }
    //取消订单
    orderCancle(nHotelID: number, nFolioID: number): Observable<Result<string>> {
        var apiUrl = `${api(EApi.orderCancle)}`;
        apiUrl += `?nHotelID=${nHotelID}`;
        apiUrl += `&nFolioID=${nFolioID}`;
        return this.m_objHttpService.post<Result<string>>(apiUrl);
    }
    //删除订单 根据房单号删除预约订单 离店、取消和未到可删除
    delMebFolio(nChainID: number, nFolioID: number): Observable<Result<string>> {
        var apiUrl = `${api(EApi.delMebFolio)}`;
        apiUrl += `?nChainID=${nChainID}`;
        apiUrl += `&nFolioID=${nFolioID}`;
        return this.m_objHttpService.post<Result<string>>(apiUrl);
    }
    //评论订单
    commentHotel(objReviews: QueryHotelComment): Observable<Result<string>> {
        var apiUrl = `${api(EApi.commentHotel)}`;
        apiUrl += `?objReviews=${JSON.stringify(objReviews)}`;
        return this.m_objHttpService.post<Result<string>>(apiUrl);
    }
    //获取酒店列表
    getHotelList(sTag: string, nCityID: number): Observable<Result<Chain[]>> {
        var apiUrl = `${api(EApi.getChain)}`;
        apiUrl += "?CityID=" + nCityID + "&Tag=" + sTag;
        return this.m_objHttpService.get<Result<Chain[]>>(apiUrl);
    }
    //获取积分信息
    getPointGatherInfo(): Observable<Result<PointGatherInfo>> {
        var apiUrl = `${api(EApi.getPointGatherInfo)}`;
        return this.m_objHttpService.get<Result<PointGatherInfo>>(apiUrl);
    }
    //获取储值信息
    getStoreValueSummary(): Observable<Result<StoreValueSummary>> {
        var apiUrl = `${api(EApi.getStoreValueSummary)}`;
        return this.m_objHttpService.get<Result<StoreValueSummary>>(apiUrl);
    }
    //获取赠送储值信息
    getPresentStoreValueSummary(): Observable<Result<PresentStoreValueSummary>> {
        var apiUrl = `${api(EApi.getPresentStoreValueSummary)}`;
        return this.m_objHttpService.get<Result<PresentStoreValueSummary>>(apiUrl);
    }
    //获取积分赠送列表
    getMemberGainPoint(nPageSize: number, nPageNo: number): Observable<Result<PageAbleList<GainPoint>>> {
        var apiUrl = `${api(EApi.getMemberGainPoint)}`;
        apiUrl += `?nPageSize=${nPageSize}`;
        apiUrl += `&nPageNo=${nPageNo}`;
        return this.m_objHttpService.get<Result<PageAbleList<GainPoint>>>(apiUrl);
    }
    //获取积分使用列表
    getMemberUsedPoint(nPageSize: number, nPageNo: number): Observable<Result<PageAbleList<UsedPoint>>> {
        var apiUrl = `${api(EApi.getMemberUsedPoint)}`;
        apiUrl += `?nPageSize=${nPageSize}`;
        apiUrl += `&nPageNo=${nPageNo}`;
        return this.m_objHttpService.get<Result<PageAbleList<UsedPoint>>>(apiUrl);
    }
    //获取储值列表
    queryStoreValueList(PageSize: number, PageNo: number): Observable<Result<PageAbleList<StoreValue>>> {
        var apiUrl = `${api(EApi.queryStoreValueList)}`;
        apiUrl += `?nPageNo=${PageNo}`;
        apiUrl += `&nPageSize=${PageSize}`;
        return this.m_objHttpService.post<Result<PageAbleList<StoreValue>>>(apiUrl);
    }
    //获取储值赠送列表
    queryPresentStoreValueList(PageSize: number, PageNo: number): Observable<Result<PageAbleList<PresentStoreValue>>> {
        var apiUrl = `${api(EApi.queryPresentStoreValueList)}`;
        apiUrl += `?nPageNo=${PageNo}`;
        apiUrl += `&nPageSize=${PageSize}`;
        return this.m_objHttpService.post<Result<PageAbleList<PresentStoreValue>>>(apiUrl);
    }
    //获取酒店信息
    getHotelInfo(sTag: string, nCityID: number, nPageIndex: number, nPageSize: number, dtStartDate: string, dtEndDate: string): Observable<Result<PageAbleList<HotelDetailsItem>>>{
        var apiUrl = `${api(EApi.getHotel)}`;
        apiUrl += "?nCityID=" + nCityID;
        apiUrl += "&sTag=" + sTag;
        apiUrl += "&nPageSize=" + nPageSize;
        apiUrl += "&nPageNo=" + nPageIndex;
        apiUrl += "&dtStartDate=" + dtStartDate;
        apiUrl += "&dtEndDate=" + dtEndDate;
        return this.m_objHttpService.get<Result<PageAbleList<HotelDetailsItem>>>(apiUrl);
    }
    //获取会员对应的价格类型
    getMebRoomRateType(nChainID: number): Observable<Result<RoomRateMebType>>{
        var apiUrl: string = api(EApi.getMebRoomRateType);
        apiUrl += "?nChainID=" + nChainID;
        return this.m_objHttpService.get<Result<RoomRateMebType>>(apiUrl);        
    }
    //计算房价
    calculatRoomRate(nChainID:number,sArrive:string,nRoomTypeID:number):Observable<Result<number>>{
        var apiUrl: string = api(EApi.calculatRoomRate);
        apiUrl += "?nChainID=" + nChainID;
        apiUrl += "&nRoomTypeID=" + nRoomTypeID;
        apiUrl += "&dtArrive=" + sArrive;
        return this.m_objHttpService.get<Result<number>>(apiUrl);     
    }
    //获取房型信息
    getRoomTypeDetail(nHotelID:number,sStartDate:string,sEndDate):Observable<Result<HotelDetailsItem>>{
        var apiUrl: string = api(EApi.getRoomTypeDetail);
        apiUrl += "?nHotelID=" + nHotelID;
        apiUrl += "&dtStartDate=" + sStartDate;
        apiUrl += "&dtEndDate=" + sEndDate;
        return this.m_objHttpService.get<Result<HotelDetailsItem>>(apiUrl);
    }
    //获取酒店评论
    getHotelComment(nHotelID: number, nImageFlag: number, nPageSize: number, nPageNo: number ,nMebID:number): Observable<Result<PageAbleList<QueryHotelComment>>> {
        var apiUrl: string = api(EApi.getHotelComment);
        apiUrl += "?nHotelID=" + nHotelID;
        apiUrl += "&nImageFlag=" + nImageFlag;
        apiUrl += "&nPageSize=" + nPageSize;
        apiUrl += "&nPageNo=" + nPageNo;
        apiUrl += "&nMebID=" + nMebID;
        return this.m_objHttpService.get<Result<PageAbleList<QueryHotelComment>>>(apiUrl);
    }
    //提交预订订单
    bookIn(objBookFolio:AddPersonBookFolio,lsAddGuestFolio:AddGuestFolio[],sSMSCode:string):Observable<Result<BookInfo>>{
        var apiUrl: string = api(EApi.bookIn);
        apiUrl += "?objBookFolio=" + JSON.stringify(objBookFolio);
        apiUrl += "&lsAddGuestFolio=" + JSON.stringify(lsAddGuestFolio);
        apiUrl += "&sSMSCode=" +sSMSCode;

        return this.m_objHttpService.post<Result<BookInfo>>(apiUrl);
    }
    //获取指定酒店服务信息
    getChainRoomServiceInfo(objChainServiceCondition: Object): Observable<Result<any>>{
        let apiUrl: string = api(EApi.getChainRoomService);
        apiUrl += "?objQueryChainServiceCondition=" + JSON.stringify(objChainServiceCondition);
        return this.m_objHttpService.get<Result<any>>(apiUrl);
    }
    //获取指定酒店房型信息
    getChainRoomTypeRemark(objChainRoomTypeRemarkCondition: object, chainId: number): Observable<Result<ChainRoomTypeRemark>>{
        let apiUrl: string = api(EApi.GetChainRoomTypeRemark);
        apiUrl += "?objChainRoomTypeRemarkCondition=" + JSON.stringify(objChainRoomTypeRemarkCondition);
        apiUrl += "&chainID=" + chainId;

        return this.m_objHttpService.get<Result<ChainRoomTypeRemark>>(apiUrl);
    }
    //增加客房服务
    addMebRoomService(nClientUserID: number, sClientUserName: string, objAddMemberRoomService: AddMebRoomService): Observable<Result<string>>{
        let apiUrl: string = api(EApi.addMemberRoomService);
        apiUrl += "?nClientUserID=" + nClientUserID;
        apiUrl += "&sClientUserName=" + sClientUserName;
        apiUrl += "&objAddMemberRoomService=" + JSON.stringify(objAddMemberRoomService);

        return this.m_objHttpService.post<Result<string>>(apiUrl);
    }

    // 更新客房服务
    UpdateMemberRoomService(nRoomServiceTransID: number, nClientUserID: number, sClientUserName: string, objUpdateMemberRoomService: UpdateMemberRoomService): Observable<Result<string>>{
        let apiUrl: string = api(EApi.updateMemberRoomService);
        apiUrl += "?nRoomServiceTransID=" + nRoomServiceTransID;
        apiUrl += "&nClientUserID=" + nClientUserID;
        apiUrl += "&sClientUserName=" + sClientUserName;
        apiUrl += "&objUpdateMemberRoomService=" + JSON.stringify(objUpdateMemberRoomService);
        return this.m_objHttpService.post<Result<string>>(apiUrl);
    }

    // 取消客房服务
    CancelMemberRoomService(nRoomServiceTransID: number, sCancelRemark: string, nClientUserID: number, sClientUserName: string): Observable<Result<string>>{
        let apiUrl: string = api(EApi.cancelMemberRoomService);
        apiUrl += "?nRoomServiceTransID=" + nRoomServiceTransID;
        apiUrl += "&sCancelRemark=" + sCancelRemark;
        apiUrl += "&nClientUserID=" + nClientUserID;
        apiUrl += "&sClientUserName=" + sClientUserName;
        return this.m_objHttpService.post<Result<string>>(apiUrl);
    }
    
    // 分页查询客房服务
    QueryMemberRoomService(nPageSize: number, nPageNo: number, objCondition: QueryMemberRoomService): Observable<Result<PageAbleList<QueryMemberRoomServiceResult>>>{
        let apiUrl: string = api(EApi.queryMemberRoomService);
        apiUrl += "?nPageSize=" + nPageSize;
        apiUrl += "&nPageNo=" + nPageNo;
        apiUrl += "&objCondition=" + JSON.stringify(objCondition);
        return this.m_objHttpService.post<Result<PageAbleList<QueryMemberRoomServiceResult>>>(apiUrl);
    }

    // 获取客房服务列表
    GetMemberRoomServiceList(nMebID: number, eStatus: number): Observable<Result<QueryMemberRoomServiceResult[]>>{
        let apiUrl: string = api(EApi.getMemberRoomServiceList);
        apiUrl += "?nMebID=" + nMebID;
        apiUrl += "&eStatus=" + eStatus;
        return this.m_objHttpService.get<Result<QueryMemberRoomServiceResult[]>>(apiUrl);
    }
}
