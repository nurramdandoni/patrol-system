const { sequelize } = require('../models');

async function checkScheduleActiveNow(payload) {
  try {
    if (!payload) return false;

    const checkerId = payload.user_id;

    const result = await sequelize.query(
      `
      SELECT s.*, sh.start_time, sh.end_time
      FROM schedule s
      JOIN shift sh ON sh.id = s.shift_id
      WHERE s.checker_id = :checkerId 
      AND (
          CONVERT_TZ(NOW(), '+00:00', '+07:00')
          BETWEEN 
              TIMESTAMP(s.schedule_date, sh.start_time)
          AND
              CASE 
                  WHEN sh.end_time > sh.start_time 
                  THEN TIMESTAMP(s.schedule_date, sh.end_time)
                  ELSE TIMESTAMP(DATE_ADD(s.schedule_date, INTERVAL 1 DAY), sh.end_time)
              END
      )
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


module.exports = checkScheduleActiveNow;
