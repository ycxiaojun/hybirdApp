export class UpdateBookShowRoom{
  public bookShowRoomID: number;
  public mobileNo: string;
  public contractName: string;
  public docTypeID: number;
  public docNo: string;  //会员卡号
  public sexID: number;  //性别
  public priceBegin: number; //最低价格
  public priceEnd: number;  //最高价格
  public roomTypeID: number;  //房型ID
  public roomNo: number;
  public otherRoomTypeList: any[];
  public otherRoomNoList: string;
  public bookRemark: string;
  public showRoomDate: Date;  //看房时间
  public statusRemark: string;
  public bookShowRoomStatus: Array<number>;


}
