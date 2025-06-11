import xlsx from 'xlsx';
import fs from 'fs';
import db from '../config/db.js';

export const uploadExcel = (req, res) => {
  const filePath = req.file?.path;

  if (!filePath) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const values = sheetData.map(row => [row.name, row.email, row.age]);

    if (values.length === 0) {
      fs.unlinkSync(filePath); 
      return res.status(400).json({ error: 'Excel file is empty or missing valid data.' });
    }

    const sql = 'INSERT INTO users (name, email, age) VALUES ?';
    db.query(sql, [values], (err, result) => {
      fs.unlinkSync(filePath); // delete uploaded file
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.status(200).json({ message: 'Excel data imported successfully!' });
    });


  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return res.status(500).json({ error: 'Failed to process Excel file.' });
  }
};



// export const getUsers=async(req,res)=>{
//     const search = req.query.search || '';

//   const sql = `SELECT * FROM users WHERE name LIKE ? OR email LIKE ?`;

//   const likeSearch = `%${search}%`;


//   db.query(sql, [likeSearch, likeSearch], (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// }




export const getUsers = (req, res) => {
  const search = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const likeSearch = `%${search}%`;

  const dataQuery = `SELECT * FROM users WHERE name LIKE ? OR email LIKE ? LIMIT ? OFFSET ?`;
  const countQuery = `SELECT COUNT(*) AS total FROM users WHERE name LIKE ? OR email LIKE ?`;

  db.query(dataQuery, [likeSearch, likeSearch, limit, offset], (err, results) => {
    if (err) return res.status(500).json({ error: err });

    db.query(countQuery, [likeSearch, likeSearch], (err2, countResult) => {
      if (err2) return res.status(500).json({ error: err2 });

      const totalRecords = countResult[0].total;
      res.json({ data: results, total: totalRecords });
    });
  });
};
