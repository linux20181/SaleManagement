import Vung from './Component/Setting/Vung';
import PhongBan from './Component/Setting/PhongBan';
import DonVi from './Component/Setting/DonVi';
import LoaiHoSo from './Component/Setting/LoaiHoSo';
import Login from './Authentication/Login/Login';
import Kho from './Component/Setting/Kho';
import TreeHuman from './Component/Human/TreeHuman';
import Tu from './Component/Setting/Tu';
import AddHuman from './Component/Human/AddHuman';
import TaoMoiHoSo from './Component/HoSo/TaoMoiHoSo';
import ChiTietHoSo from './Component/HoSo/ChiTietHoSo';
import DanhSachHoSo from './Component/HoSo/DanhSachHoSo';
import Home from './Component/Dashboard/dashboard';
import ViewTaiLieu from './Component/TaiLieu/ViewTaiLieu';
import TaoPhieuMuon from './Component/MuonTra/TaoMoiPhieu';
import DanhSachPhieu from './Component/MuonTra/DanhSachPhieu';
import ChiTietPhieu from './Component/MuonTra/ChiTietPhieu';
import DetailHuman from './Component/Human/DetailHuman';
import DangKyNghi from './Component/Human/DangKyNghi';
import DetailPhieu from './Component/Human/DetailPhieu';
import ChangePass from './Authentication/ChangePass';
export const APP_STATE = {
    HOME :{
        url:"/home",
        component : Home
    },
    SETTING: {
        VUNG: {
            url: "/setting/vung",
            component: Vung,
        },
        LOAIHOSO :{
            url: "/setting/lhs",
            component: LoaiHoSo,
        },
        PHONGBAN :{
            url: "/setting/phongban",
            component: PhongBan,
        },
        DONVI:{
            url: "/setting/donvi",
            component: DonVi,
        },  
        KHO:{
            url: "/setting/kho",
            component: Kho,
        }, 
        TU:{
            url: "/setting/tu",
            component: Tu,
        } 
    },
    TAILIEU :{
        DANHSACHTAILIEU:{
            url:"/tailieu/danhsach",
            component:ViewTaiLieu,
        }
    },
    HOSO: {
        TAOMOIHOSO:{
        url: "/hoso/taomoi",
        component:TaoMoiHoSo,
        },
        CHITIETHOSO:{
            url : "/hosotailieu/:id",
            component: ChiTietHoSo
        },
        DANHSACHHOSO:{
            url : "/hoso/danhsach",
            component:DanhSachHoSo  
        }
    },
    DANGKYMUON :{
        CHITIETPHIEU:{
            url : "/chitiet-phieumuon/:id",
            component: ChiTietPhieu,
        },
        TAOMOI:{
            url:"/dangkymuon/taophieu",
            component: TaoPhieuMuon ,
        },
        DANHSACH:{
            url:"/phieumuon/danhsach",
            component:DanhSachPhieu,
        }
    },
    NHANSU: {
        TREEHUMAN:{
            url:"/nhansu/sodonhansu",
            component:TreeHuman
        },
        ADDHUMAN :{
            url:"/nhansu/themnhansu",
            component:AddHuman,
        },
        DETAILHUMAN : {
            url:"/nhansu/chitiet/:id",
            component:DetailHuman,
        },
        DANGKYNGHI:{
            url:"/nhansu/dangkynghi",
            component:DangKyNghi,
        },
        DETAILPHIEUNGHI:{
            url:"/nhansu/phieunghi/:id",
            component:DetailPhieu,
        }
    },
    LOGIN : {
        url: '/login',
        component : Login,
    },
    AUTHEN :{
        url:'/nguoidung/doimatkhau',
        component : ChangePass,
    }
    // APP : {
    //     url : '/home',
    //     component :App,
    // }

} 