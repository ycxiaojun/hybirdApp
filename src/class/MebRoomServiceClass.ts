export class AddMebRoomService {
	chainID: number;
	folioID: number;
	roomNo: string;
	mebID: number;
	createTime: string;
	roomServiceTypeID: number;
	roomServiceSubTypeID: number;
	roomServiceRemark: string;
	serviceStatus: number;
	statusRemark: string;
	lastUserID: number;
	lastUserName: string;
	lastUserTime: string;
}

export class UpdateMemberRoomService {
	roomServiceTypeID: number;
	roomServiceSubTypeID: number;
	roomServiceRemark: string;
	serviceStatus: number;
	statusRemark: string;
	lastUserID: number;
	lastUserName: string;
	lastUserTime: string;
}

export class QueryMemberRoomService {
	roomServiceTransID: number;
	chainID: number;
	folioID: number;
	roomNo: string;
	mebID: number;
	roomServiceTypeID: number;
	roomServiceSubTypeID: number;
	roomServiceRemark: string;
	createTimeBegin: string;
	createTimeEnd: string;
	serviceStatus: number;
}

export class QueryMemberRoomServiceResult {
	RoomServiceTransID: number;
    ChainID: number;
    FolioID: number;
    RoomNo: string;
    MebID: number;
    CreateTime: string;
	RoomServiceTypeID: number;
	RoomServiceTypeName: string;
	RoomServiceSubTypeID: number;
	RoomServiceSubTypeName :string;
    RoomServiceRemark: string;
    ServiceStatus: number;
    StatusRemark: string;
    LastUserID: number;
    LastUserName: string;
    LastUserTime: string;
}