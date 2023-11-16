export class SiteAdmin {
    public siteAdminID: string;
    public clientID: string;
    public name: string;
    public userName: string;
    public password: string;
    public ConfirmPassword: string;
    public mailId: string;
    public mobileNumber: string;
    public saveMode: string;
    public ResetPassword: string;
    public ResetConfirmPassword: string;
}

export class sensorDetails {
    public HubId: string;
    public HubCategoryId: string;
    public SensorId: string;
    public SensorType: string;
    public ModelNo: string;
    public Vendor: string;
    public clientDB: string;
    public IsSensorActive: boolean;
    public DataFormat: string;
    public from: string;
    public to: string;
    public Delivery: Date;
}

export class HWType {
    public HardwareName: string;
    public HardwareType: string;
    public ShortName: string;
    public ModelNo: string;
    public Vendor: string;
    public OS: string;
    public dataformat: string;
}

export class HardwareTypes {
    public HardwareId: string;
    public HardwareName: string;
}