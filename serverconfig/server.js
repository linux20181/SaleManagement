const express = require('express');
const _mysql = require('./Data/connection');
const cors = require('cors');
const app = express();
const saltRounds = 10;
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var SendMail = require('./Mail/SendMail');
const corsOptions = {
  origin: "*",
  methods: ['GET', 'DELETE', 'POST'],
}
const port = 3097;
var connection = _mysql.connection();
app.use(cors(corsOptions));
app.use(bodyParser.json())
connection.connect(function (err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
});
// replace chuỗi str có ký tự str1 thanh str2 . Do  replace () chỉ thay the được 1 ký tự sau một lần gọi . str la chuoi can replace , str1 la ky tu replace,str2 la ky tu thay the
function replaceString(str, str1, str2) {
  var cloneStr = str;
  for (let i = 0; i < str.length; i++) {
    cloneStr = cloneStr.replace(str1, str2);
  }
  return cloneStr;
}

// replace ky tu
function replaceChar(str){
  if(str === ""){
    return " ";
  }
var cloneStr = str;
for (let i = 0; i < str.length; i++) {

  // ư

  cloneStr = cloneStr.replace('%C6%B0','ư');
  cloneStr = cloneStr. replace('%E1%BB%A9','ứ');
  cloneStr = cloneStr.replace('%E1%BB%AB','ừ');
  cloneStr = cloneStr.replace('%E1%BB%B1','ự');
  cloneStr = cloneStr.replace('%E1%BB%AD','ử');
  cloneStr = cloneStr.replace('%E1%BB%AF','ữ');
  
// u

 cloneStr = cloneStr. replace('%C3%BA','ú');
 cloneStr = cloneStr.replace('%C3%B9','ù');
 cloneStr = cloneStr.replace('%E1%BB%A5','ụ');
 cloneStr = cloneStr.replace('%E1%BB%A7','ủ');
 cloneStr = cloneStr.replace('%C5%A9','ũ');

  // i

  cloneStr = cloneStr. replace('%C3%AD','í');
  cloneStr = cloneStr.replace('%C3%AC','ì');
  cloneStr = cloneStr.replace('%E1%BB%8B','ị');
  cloneStr = cloneStr.replace('%E1%BB%89','ỉ');
  cloneStr = cloneStr.replace('%C4%A9','ĩ');

  // o
  cloneStr = cloneStr. replace('%C3%B3','ó');
  cloneStr = cloneStr.replace('%C3%B2','ò');
  cloneStr = cloneStr.replace('%E1%BB%8D','ọ');
  cloneStr = cloneStr.replace('%E1%BB%8F','ỏ');
  cloneStr = cloneStr.replace('%C3%B5','õ');

  // ô 

  cloneStr = cloneStr.replace('%C3%B4','ô');
  cloneStr = cloneStr. replace('%E1%BB%91','ố');
  cloneStr = cloneStr.replace('%E1%BB%93','ồ');
  cloneStr = cloneStr.replace('%E1%BB%99','ộ');
  cloneStr = cloneStr.replace('%E1%BB%95','ổ');
  cloneStr = cloneStr.replace('%E1%BB%97','ỗ');

  // ơ 

  cloneStr = cloneStr.replace('%C6%A1','ơ');
  cloneStr = cloneStr. replace('%E1%BB%9B','ớ');
  cloneStr = cloneStr.replace('%E1%BB%9D','ờ');
  cloneStr = cloneStr.replace('%E1%BB%A3','ợ');
  cloneStr = cloneStr.replace('%E1%BB%9F','ở');
  cloneStr = cloneStr.replace('%E1%BB%A1','ỡ');

  //e 
  cloneStr = cloneStr. replace('%C3%A9','é');
  cloneStr = cloneStr.replace('%C3%A8','è');
  cloneStr = cloneStr.replace('%E1%BA%B9','ẹ');
  cloneStr = cloneStr.replace('%E1%BA%BB','ẻ');
  cloneStr = cloneStr.replace('%E1%BA%BD','ẽ');
  //ê
  cloneStr = cloneStr.replace('%C3%AA','ê');
  cloneStr = cloneStr. replace('%E1%BA%BF','ế');
  cloneStr = cloneStr.replace('%E1%BB%81','ề');
  cloneStr = cloneStr.replace('%E1%BB%87','ệ');
  cloneStr = cloneStr.replace('%E1%BB%83','ể');
  cloneStr = cloneStr.replace('%E1%BB%85','ễ');
  //a
  cloneStr = cloneStr.replace('%C3%A1','á');
  cloneStr = cloneStr.replace('%E1%BA%A1','ạ');
  cloneStr = cloneStr.replace('%C3%A3','ã');
  cloneStr = cloneStr.replace('%C3%A3','ả');
  cloneStr = cloneStr.replace('%C3%A3','à');
  // â
  cloneStr = cloneStr.replace('%C3%A2','â')
  cloneStr = cloneStr.replace('%E1%BA%A5','ấ');
  cloneStr = cloneStr.replace('%E1%BA%AD','ậ');
  cloneStr = cloneStr.replace('%E1%BA%AB','ẫ');
  cloneStr = cloneStr.replace('%E1%BA%A9','ẩ');
  cloneStr = cloneStr.replace('%E1%BA%A7','ầ');
  //ă
  cloneStr = cloneStr.replace('%C4%83','ă')
  cloneStr = cloneStr.replace('%E1%BA%AF','ắ');
  cloneStr = cloneStr.replace('%E1%BA%B7','ặ');
  cloneStr = cloneStr.replace('%E1%BA%B5','ẵ');
  cloneStr = cloneStr.replace('%E1%BA%B3','ẳ');
  cloneStr = cloneStr.replace('%E1%BA%B1','ằ');
}
return cloneStr;
}
//------------------------------------------ Phiếu nghỉ 
app.get('/phieunghis', (req, res) => {
  connection.query("Select * from phieunghis", function (error, result) {
    res.send(result);
  })
})

app.get('/phieunghis/:id', (req, res) => {
  var id = req.params.id;
  connection.query("Select * from phieunghis where IdPhieuNghi = " + id, function (error, result) {
    res.send(result);
  })
})

app.post('/api/phieunghis', (req, res) => {
  var values = [
    [req.body.MaPhieuNghi, req.body.TenNguoiDangKy, req.body.IdNguoiDangKy, req.body.ThoiGianNghi,req.body.ThoiGianKetThuc,req.body.LyDo,req.body.NguoiPheDuyet,req.body.TrangThaiPhieuNghi]
  ];
  if(req.body.IdPhieuNghi ===undefined){

    connection.query("INSERT INTO phieunghis (MaPhieuNghi,TenNguoiDangKy,IdNguoiDangKy,ThoiGianNghi,ThoiGianKetThuc,LyDo,NguoiPheDuyet,TrangThaiPhieuNghi) VALUES ?", [values], function (err, result) {
      if (err) {
        console.log(err);
      }
      res.send(result);
    })
  } else {
    connection.query("UPDATE phieunghis SET  TrangThaiPhieuNghi = ? Where IdPhieuNghi = ?", [ req.body.TrangThaiPhieuNghi,req.body.IdPhieuNghi], function (err, result) {
      if (err) {
        console.log(err);
      }
      res.send(result);
    })
  }
})

app.delete('/phieunghis/:id', (req, res) => {
  var id = JSON.stringify(req.params.id);
  console.log(id);
  connection.query('DELETE FROM phieunghis WHERE IdPhieuNghi = ' + id, function (error, results) {
    if (error) throw error;
    res.send(results)
  });
})
//------------------------------------------Lịch sử
app.get('/logs', (req, res) => {
  connection.query("Select * from logs", function (error, result) {
    res.send(result);
  })
})
app.post('/api/logs', (req, res) => {
  var values = [
    [req.body.Author, req.body.NoiDung, req.body.NgayTao, req.body.GuidId]
  ];
  connection.query("INSERT INTO logs (Author,NoiDung,NgayTao,GuidId) VALUES ?", [values], function (err, result) {
    if (err) {
      console.log(err);
    }
    res.send(result);
  })

})
//------------------------------------------Phieu Muon 
app.get('/phieumuons', (req, res) => {
  connection.query("Select * from phieumuons ", function (error, results) {
    if (error) throw error;
    res.send(results);
  })
})

app.get('/phieumuons/:id', (req, res) => {
  var id = req.params.id;
  connection.query("Select * from phieumuons where IdPhieuMuon = " + id, function (error, result) {
    res.send(result);
  })
})

app.post('/api/phieumuons', (req, res) => {
  console.log(req.body);
  var values = [
    [req.body.MaPhieuMuon, req.body.TenPhieuMuon, req.body.ThoiGianMuon, req.body.ThoiGianTra, req.body.MucDichMuon, req.body.TenHoSoMuonId, req.body.TrangThai, req.body.Author]
  ];
  if (req.body.IdPhieuMuon === undefined) {
    var content = "<h1>Xác nhận mượn tài liệu</h1> \n " +
        "<p>Kính thưa ông/bà </p> \n" +
        "<p> Ông/ bà đã mượn thành công hồ sơ có tên : <b>" + req.body.TenHoSoDaChoMuon + "</b> , vào ngày " +req.body.ThoiGianMuon +  ", hạn trả vào ngày "+req.body.ThoiGianTra +"</p> \n" +
        "<p>Hết ngày "+ req.body.ThoiGianTra +" nếu ống bà không hoàn trả lại hồ sơ . Chúng tôi sẽ xử lý theo nội quy mượn trả .</p> \n" +
        " <p> Xin chân thành cảm ơn ông/bà !!!</p>"
    connection.query("INSERT INTO phieumuons (MaPhieuMuon,TenPhieuMuon,ThoiGianMuon,ThoiGianTra,MucDichMuon,TenHoSoMuonId,TrangThai,Author) VALUES ?", [values], function (err, result) {
      if (err) {
        console.log(err);
      }

      SendMail.sendMail(req.body.Author, 'Xác nhận mượn tài liệu', content);
      res.send(result);
    })
  } else {
    connection.query("UPDATE phieumuons SET  MaPhieuMuon = ? , TenPhieuMuon = ? , ThoiGianMuon = ? ,ThoiGianTra = ? , MucDichMuon = ? ,TenHoSoMuonId = ? ,TrangThai = ? , Author = ? Where IdPhieuMuon = ?", [req.body.MaPhieuMuon, req.body.TenPhieuMuon, req.body.ThoiGianMuon, req.body.ThoiGianTra, req.body.MucDichMuon, req.body.TenHoSoMuonId, req.body.TrangThai, req.body.Author, req.body.IdPhieuMuon], function (err, result) {
      if (err) {
        console.log(err);
      }
      res.send(result);
    })
  }
})
app.delete('/phieumuons/:id', (req, res) => {
  var id = JSON.stringify(req.params.id);
  console.log(id);
  connection.query('DELETE FROM phieumuons WHERE IdPhieuMuon = ' + id, function (error, results) {
    if (error) throw error;
    res.send(results)
  });
})
// -----------------------------------------Tài Liệu
app.post('/api/tailieus', (req, res) => {
  console.log(req.body);
  var values = [
    [req.body.TenTaiLieu, req.body.SoHieuTaiLieu, req.body.HoSoTaiLieuId, req.body.LoaiTaiLieuId, req.body.DonViBanHanhId, req.body.DangVanBan, req.body.PhongBanPheDuyetId, req.body.NgayBanHanh, req.body.NgayHetHan, req.body.GhiChuTL, req.body.TinhTrangMuonTra, req.body.MaTaiLieuVanThu, req.body.SoTrang, req.body.CapMatTL, req.body.NgayTao]
  ];
  if (req.body.IdTaiLieu === undefined) {

    connection.query("INSERT INTO tailieus (TenTaiLieu,SoHieuTaiLieu,HoSoTaiLieuId,LoaiTaiLieuId,DonViBanHanhId,DangVanBan,PhongBanPheDuyetId,NgayBanHanh,NgayHetHan,GhiChuTL,TinhTrangMuonTra,MaTaiLieuVanThu,SoTrang,CapMatTL,NgayTao) VALUES ?", [values], function (err, result) {
      if (err) {
        console.log(err);
      }
      res.send(result);
    })
  } else {
    connection.query("UPDATE tailieus SET  TenTaiLieu = ? , SoHieuTaiLieu = ? , HoSoTaiLieuId = ? ,LoaiTaiLieuId = ? , DonViBanHanhId = ? ,DangVanBan = ? ,PhongBanPheDuyetId = ? , NgayBanHanh = ? , NgayHetHan = ? , GhiChuTL = ? , TinhTrangMuonTra = ? , MaTaiLieuVanThu = ? , SoTrang = ? ,CapMatTL = ? , NgayTao = ? Where IdTaiLieu = ?", [req.body.TenTaiLieu, req.body.SoHieuTaiLieu, req.body.HoSoTaiLieuId, req.body.LoaiTaiLieuId, req.body.DonViBanHanhId, req.body.DangVanBan, req.body.PhongBanPheDuyetId, req.body.NgayBanHanh, req.body.NgayHetHan, req.body.GhiChuTL, req.body.TinhTrangMuonTra, req.body.MaTaiLieuVanThu, req.body.SoTrang, req.body.CapMatTL, req.body.NgayTao, req.body.IdTaiLieu], function (err, result) {
      if (err) {
        console.log(err);
      }
      res.send(result);
    })
  }
})
app.get('/tailieus', (req, res) => {
  var query_ = '';
  if(req._parsedUrl.query){
    query_=replaceString(replaceString(req._parsedUrl.query,"%20"," "),"%27","'");
    query_ = replaceChar(query_)
  }
  connection.query("Select * from tailieus " + query_, function (error, results) {
    if (error) throw error;
    res.send(results);
  })
})
app.get('/tailieus/:id', (req, res) => {
  var id = req.params.id;
  connection.query("Select * from tailieus where IdTaiLieu = " + id, function (error, result) {
    res.send(result);
  })
})
app.delete('/tailieus/:id', (req, res) => {
  var id = JSON.stringify(req.params.id);
  console.log(id);
  connection.query('DELETE FROM tailieus WHERE IdTaiLieu = ' + id, function (error, results) {
    if (error) throw error;
    res.send(results)
  });
})
//------------------------------------------Hồ sơ tài liệu
app.get('/hosotailieus/all', (req, res) => {
  connection.query("Select * from hosotailieus ", function (error, results) {
    if (error) throw error;
    res.send(results);
  })
})
app.get('/hosotailieus', (req, res) => {
  var query_ = "";
  if(req._parsedUrl.query){
    query_=replaceString(replaceString(req._parsedUrl.query,"%20"," "),"%27","'");
    query_ = replaceChar(query_)
  }
  connection.query("SELECT * from hosotailieus JOIN loaihosos on hosotailieus.LoaiHoSoId = loaihosos.IdLoaiHoSo JOIN donvis on hosotailieus.DonViSoHuuId = donvis.IdDonVi JOIN phongbans on phongbans.IdPhongBan = hosotailieus.PhongBanSoHuuId " + query_ , function (error, results) {
    if (error) throw error;
    res.send(results);
  })
})

app.get('/hosotailieus/:id', (req, res) => {
  var id = req.params.id;
  connection.query("Select * from hosotailieus where id = " + id, function (error, result) {
    res.send(result);
  })
})

app.delete('/hosotailieus/:id', (req, res) => {
  var id = JSON.stringify(req.params.id);
  console.log(id);
  connection.query('DELETE FROM hosotailieus WHERE IdHoSo = ' + id, function (error, results) {
    if (error) throw error;
    res.send(results)
  });
})

app.post('/api/hosotailieus', (req, res) => {
  var values = [
    [req.body.NgayTao, req.body.SoHieuHoSo, req.body.TenHoSo, req.body.LoaiHoSoId, req.body.MasterData, req.body.DonViSoHuuId, req.body.PhongBanSoHuuId, req.body.NamHoSo, req.body.GhiChu, req.body.VungId, req.body.KhoId, req.body.TuId, req.body.Author, req.body.id, req.body.TinhTrangMuonTra]
  ];
  if (req.body.IdHoSo === undefined) {
    connection.query("INSERT INTO hosotailieus (NgayTao,SoHieuHoSo,TenHoSo,LoaiHoSoId,MasterData,DonViSoHuuId,PhongBanSoHuuId,NamHoSo,GhiChu,VungId,KhoId,TuId,Author,id,TinhTrangMuonTra) VALUES ?", [values], function (err, result) {
      if (err) {
        console.log(err);
      }
      res.send(result);
    })
  }
  if (req.body.IdHoSo) {
    connection.query("UPDATE hosotailieus SET LoaiHoSoId = ? , MasterData = ? , DonViSoHuuId = ? ,PhongBanSoHuuId = ? , NamHoSo = ? ,GhiChu = ? , VungId = ? , KhoId = ? , TuId = ? , Author = ?,TinhTrangMuonTra = ? WHERE IdHoSo= ?", [req.body.LoaiHoSoId, req.body.MasterData, req.body.DonViSoHuuId, req.body.PhongBanSoHuuId, req.body.NamHoSo, req.body.GhiChu, req.body.VungId, req.body.KhoId, req.body.TuId, req.body.Author, req.body.TinhTrangMuonTra, req.body.IdHoSo, ], function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("Update");
      res.send(result);
    })
  }
})
// -----------------------------------------Nguoi Dung
app.get('/nguoidungs', (req, res) => {
  var _query = " ";
  if (req._parsedUrl.query) {
    _query = replaceString(req._parsedUrl.query, "%20", " ");
  }
  connection.query("Select * from users " + _query, function (error, results) {
    if (error) throw error;
    res.send(results);
  })
})

app.get('/nguoidungs/:id', (req, res) => {
  var id = req.params.id;
  connection.query("Select * from users where ID = " + id, function (error, result) {
    res.send(result);
  })
})

app.post('/api/nguoidungs', (req, res) => {
  var _res = res;
  connection.query('SELECT * FROM users WHERE Email= ' + JSON.stringify(req.body.Email), function (err, results) {
    console.log(results);
    if (err) {
      throw err;
    }
    if (!err) {
      bcrypt.compare(req.body.MatKhau, results[0].MatKhau).then(
        function (res) {
          if (res) {
            var token = jwt.sign({
              Email: req.body.Email,
              MatKhau: req.body.MatKhau
            }, "Cu")
            _res.json({
              token: token,
              result: results[0]
            });
          } else {
            _res.json({
              token: null
            })
          }
        }
      )
    }
  })
})
app.post('/register/nguoidungs', (req, res) => {
  var MatKhau = bcrypt.hashSync(req.body.MatKhau, saltRounds)
  var values = [
    [req.body.HoTen, req.body.Tuoi, req.body.Email, MatKhau, req.body.ViTri, req.body.Phone, req.body.GroupOfUser, req.body.PhongBan, req.body.Cap, req.body.DiaChi, req.body.QuanLy]
  ];
  if (req.body.ID === undefined) {
    connection.query("INSERT INTO users (HoTen,Tuoi,Email,MatKhau,ViTri,Phone,GroupOfUser,PhongBan,Cap,DiaChi,QuanLy) VALUES ?", [values], function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("Create");
      res.send(result);
    })
  }
  if (req.body.ID) {
    connection.query("UPDATE users SET DiaChi= ? , Tuoi = ? , Phone = ?   WHERE ID= ?", [req.body.DiaChi, req.body.Tuoi, req.body.Phone, req.body.ID], function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("Update");
      res.send(result);
    })
  }
})

app.post('/register/nguoidungs', (req, res) => {
  var MatKhau = bcrypt.hashSync(req.body.MatKhau, saltRounds)
  var values = [
    [req.body.HoTen, req.body.Tuoi, req.body.Email, MatKhau, req.body.ViTri, req.body.Phone, req.body.GroupOfUser, req.body.PhongBan, req.body.Cap, req.body.DiaChi, req.body.QuanLy]
  ];
  if (req.body.ID === undefined) {
    connection.query("INSERT INTO users (HoTen,Tuoi,Email,MatKhau,ViTri,Phone,GroupOfUser,PhongBan,Cap,DiaChi,QuanLy) VALUES ?", [values], function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("Create");
      res.send(result);
    })
  }
  if (req.body.ID) {
    connection.query("UPDATE users SET DiaChi= ? , Tuoi = ? , Phone = ?   WHERE ID= ?", [req.body.DiaChi, req.body.Tuoi, req.body.Phone, req.body.ID], function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("Update");
      res.send(result);
    })
  }
})

app.post('/changepass/nguoidungs', (req, res) => {
  var MatKhau = bcrypt.hashSync(req.body.MatKhau, saltRounds)
  if (req.body.ID) {
    connection.query("UPDATE users SET MatKhau= ?  WHERE ID= ?", [MatKhau, req.body.ID], function (err, result) {
      if (err) {
        console.log(err);
      }
      res.send(result);
    })
  }
})

//----------------------------------------------Tủ
app.get('/tus', (req, res) => {
  var query_ = "";
  if(req._parsedUrl.query){
    query_=replaceString(replaceString(req._parsedUrl.query,"%20"," "),"%27","'");
    query_ = replaceChar(query_)
  }
  connection.query('SELECT * from tus join khos Where tus.KhoId = khos.IdKho ' + query_, function (error, results) {
    if (error) throw error;
    res.send(results)
  });;
})
app.delete('/tus/:id', (req, res) => {
  var id = JSON.stringify(req.params.id);
  console.log(id);
  connection.query('DELETE FROM tus WHERE IdTu = ' + id, function (error, results) {
    if (error) throw error;
    res.send(results)
  });
})
app.post('/api/tus', (req, res) => {
  console.log(req.body.IdPhongBan);
  var values = [
    [req.body.TenTu, req.body.MaTu, req.body.KhoId]
  ];
  if (req.body.IdTu === undefined) {
    connection.query("INSERT INTO tus (TenTu,MaTu,KhoId) VALUES ?", [values], function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("Create");
      res.send(result);
    })
  }
  if (req.body.IdTu) {
    connection.query("UPDATE tus SET TenTu= ? , MaTu = ? , KhoId = ?  WHERE IdTu= ?", [req.body.TenTu, req.body.MaTu, req.body.KhoId, req.body.IdTu], function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("Update");
      res.send(result);
    })
  }
})

//----------------------------------------------Phòng ban

app.get('/phongbans', (req, res) => {
  var query_ = "";
  if(req._parsedUrl.query){
    query_=replaceString(replaceString(req._parsedUrl.query,"%20"," "),"%27","'");
    query_ = replaceChar(query_)
  }
  connection.query('SELECT * from phongbans join donvis Where phongbans.DonViId = donvis.IdDonVi ' + query_, function (error, results) {
    if (error) throw error;
    res.send(results)
  });;
})
app.delete('/phongbans/:id', (req, res) => {
  var id = JSON.stringify(req.params.id);
  console.log(id);
  connection.query('DELETE FROM phongbans WHERE IdPhongBan = ' + id, function (error, results) {
    if (error) throw error;
    res.send(results)
  });;
})
app.post('/api/phongbans', (req, res) => {
  console.log(req.body.IdPhongBan);
  var values = [
    [req.body.TenPhongBan, req.body.MaPhongBan, req.body.DonViId]
  ];
  if (req.body.IdKho === undefined) {
    connection.query("INSERT INTO phongbans (TenPhongBan, MaPhongBan,DonViId) VALUES ?", [values], function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("Create");
      res.send(result);
    })
  }
  if (req.body.IdKho) {
    connection.query("UPDATE phongbans SET TenPhongBan= ? , MaPhongBan = ? , DonViId = ?  WHERE IdPhongBan= ?", [req.body.TenPhongBan, req.body.MaPhongBan, req.body.DonViId, req.body.IdPhongBan], function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("Update");
      res.send(result);
    })
  }
})
//----------------------------------------------Đơn vị

app.get('/donvis', (req, res) => {
  var query_ = '';
  if(req._parsedUrl.query){
    query_=replaceString(replaceString(req._parsedUrl.query,"%20"," "),"%27","'");
    query_ = replaceChar(query_)
  }
  connection.query("SELECT * from donvis " + query_, function (error, results) {
    if (error) throw error;
    res.send(results)
  });;
})
app.delete('/donvis/:id', (req, res) => {
  var id = JSON.stringify(req.params.id);
  connection.query('DELETE FROM donvis WHERE IdDonVi = ' + id, function (error, results) {
    if (error) throw error;
    res.send(results)
  });;
})
app.post('/api/donvis', (req, res) => {
  var values = [
    [req.body.TenDonVi, req.body.MaDonVi]
  ];
  if (req.body.IdVung === undefined) {
    connection.query("INSERT INTO donvis (TenDonVi, MaDonVi) VALUES ?", [values], function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("Create");
      res.send(result);
    })
  }
  if (req.body.IdVung) {
    connection.query("UPDATE donvis SET TenDonVi= ? , MaDonVi = ?  WHERE IdDonVi= ?", [req.body.TenDonVi, req.body.MaDonVi, req.body.IdDonVi], function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("Update");
      res.send(result);
    })
  }
})
// ---------------------------------------------Kho
app.get('/khos', (req, res) => {
  var query_ = "";
  if(req._parsedUrl.query){
    query_=replaceString(replaceString(req._parsedUrl.query,"%20"," "),"%27","'");
    query_ = replaceChar(query_)
  }
  connection.query("SELECT * from khos join vungs Where khos.Vungid = vungs.IdVung " + query_ , function (error, results) {
    if (error) throw error;
    res.send(results)
  });;
})
app.delete('/khos/:id', (req, res) => {
  var id = JSON.stringify(req.params.id);
  console.log(id);
  connection.query('DELETE FROM khos WHERE IdKho = ' + id, function (error, results) {
    if (error) throw error;
    res.send(results)
  });;
})
app.post('/api/khos', (req, res) => {
  console.log(req.body.IdKho);
  var values = [
    [req.body.TenKho, req.body.MaKho, req.body.VungId]
  ];
  if (req.body.IdKho === undefined) {
    connection.query("INSERT INTO khos (TenKho, MaKho,VungId) VALUES ?", [values], function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("Create");
      res.send(result);
    })
  }
  if (req.body.IdKho) {
    connection.query("UPDATE khos SET TenKho= ? , MaKho = ? , VungId = ?  WHERE IdKho= ?", [req.body.TenKho, req.body.MaKho, req.body.VungId, req.body.IdKho], function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("Update");
      res.send(result);
    })
  }
})
// ---------------------------------------------Vùng
app.get('/vungs', (req, res) => {
  var query_ = "";
  if(req._parsedUrl.query){
    query_=replaceString(replaceString(req._parsedUrl.query,"%20"," "),"%27","'");
    query_ = replaceChar(query_)
  }
  connection.query('SELECT * from vungs ' + query_ , function (error, results) {
    if (error) throw error;
    res.send(results)
  });;
})
app.delete('/vungs/:id', (req, res) => {
  var id = JSON.stringify(req.params.id);
  console.log(id);
  connection.query('DELETE FROM vungs WHERE IdVung = ' + id, function (error, results) {
    if (error) throw error;
    res.send(results)
  });;
})
app.post('/api/vungs', (req, res) => {
  console.log(req.body.IdVung);
  var values = [
    [req.body.TenVung, req.body.MaVung]
  ];
  if (req.body.IdVung === undefined) {
    connection.query("INSERT INTO vungs (TenVung, MaVung) VALUES ?", [values], function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("Create");
      res.send(result);
    })
  }
  if (req.body.IdVung) {
    connection.query("UPDATE vungs SET TenVung= ? , MaVung = ?  WHERE IdVung= ?", [req.body.TenVung, req.body.MaVung, req.body.IdVung], function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("Update");
      res.send(result);
    })
  }
})
// -------------------------------------------Loai Ho So
app.get('/loaihosos', (req, res) => {
  var query_ = "";
  if(req._parsedUrl.query){
    query_=replaceString(replaceString(req._parsedUrl.query,"%20"," "),"%27","'");
    query_ = replaceChar(query_)
  }
  connection.query('SELECT * from loaihosos ' + query_ , function (error, results) {
    if (error) throw error;
    res.send(results)
  });
})
app.delete('/loaihosos/:id', (req, res) => {
  var id = JSON.stringify(req.params.id);
  connection.query('DELETE FROM loaihosos WHERE IdLoaiHoSo = ' + id, function (error, results) {
    if (error) throw error;
    res.send(results)
  });;
})
app.post('/api/loaihosos', (req, res) => {
  var values = [
    [req.body.TenLoaiHoSo, req.body.MaLoaiHoSo, req.body.Cap]
  ];
  if (req.body.IdLoaiHoSo === undefined) {
    connection.query("INSERT INTO loaihosos (TenLoaiHoSo, MaLoaiHoSo,Cap) VALUES ?", [values], function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("Create");
      res.send(result);
    })
  }
  if (req.body.IdLoaiHoSo) {
    connection.query("UPDATE loaihosos SET TenLoaiHoSo= ? , MaLoaiHoSo = ? , Cap = ? WHERE IdLoaiHoSo= ?", [req.body.TenLoaiHoSo, req.body.MaLoaiHoSo, req.body.Cap, req.body.IdLoaiHoSo], function (err, result) {
      if (err) {
        console.log(err);
      }
      console.log("Update");
      res.send(result);
    })
  }

})

function restartServer() {
  return app.listen(port, () => console.log(`Server running : ${port}!`))
}
app.listen(port, () => console.log(`Server running : ${port}!`))