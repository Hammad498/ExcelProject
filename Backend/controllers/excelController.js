



import xlsx from 'xlsx';
import db from '../config/db.js';

export const uploadExcel = (req, res) => {
  const fileBuffer = req.file?.buffer;
  const userId = req.user.id;

  if (!fileBuffer) return res.status(400).json({ error: 'No file uploaded' });

  try {
    // Read from buffer, not file path
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const values = sheetData
      .filter(row => row.email)
      .map(row => [row.name, row.email, row.age, userId]);

    if (values.length === 0) {
      return res.status(400).json({ error: 'No valid data in file' });
    }

    const placeholders = values.map(() => '(?, ?, ?, ?)').join(', ');
    const flatValues = values.flat();

    

    const query = 
  `INSERT INTO imported_records (name, email, age, user_id)
   VALUES ${placeholders}
   ON DUPLICATE KEY UPDATE 
   name=VALUES(name), age=VALUES(age), user_id=VALUES(user_id)`;


    db.query(query, flatValues, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.status(200).json({ message: 'File processed' });
    });

  } catch (err) {
    res.status(500).json({ error: 'Failed to process file' });
  }
};



export const getUsers = (req, res) => {
  const search = req.query.search || '';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const likeSearch = `%${search}%`;

  if (search) {
    // If search is active, fetch all matching without pagination
    db.query(
      `SELECT * FROM imported_records WHERE name LIKE ? OR email LIKE ?`,
      [likeSearch, likeSearch],
      (err, dataResult) => {
        if (err) return res.status(500).json({ error: err });

        res.json({
          data: dataResult,
          total: dataResult.length,
        });
      }
    );
  } else {
    // With no search, use pagination
    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM imported_records
    `;
    const dataQuery = `
      SELECT * 
      FROM imported_records 
      LIMIT ? OFFSET ?
    `;

    db.query(countQuery, (err, countResult) => {
      if (err) return res.status(500).json({ error: err });

      const total = countResult[0].total;

      db.query(dataQuery, [limit, offset], (err, dataResult) => {
        if (err) return res.status(500).json({ error: err });

        res.json({
          data: dataResult,
          total: total,
        });
      });
    });
  }
};
