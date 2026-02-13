const { sequelize } = require('../models');

async function checkScheduleToday(payload) {
  try {
    if (!payload) return false;

    const checkerId = payload.user_id;

    const result = await sequelize.query(
      `
      SELECT s.*, sh.start_time, sh.end_time
      FROM schedule s
      JOIN shift sh ON sh.id = s.shift_id
      WHERE s.checker_id = :checkerId 
      AND s.status = 1
      AND DATE(CONVERT_TZ(NOW(), '+00:00', '+07:00')) = s.schedule_date
      LIMIT 1
      `,
      {
        replacements: { checkerId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    return result;

  } catch (err) {
    console.error('Error checking schedule:', err);
    return false;
  }
}


module.exports = checkScheduleToday;
