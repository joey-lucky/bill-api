let sql = `
            select *
            from bd_fund_deal t
            where t.data_status = '0'
              and t.apply_buy_date < str_to_date(@datetime, '%Y-%m-%d %H:%i:%s')
            order by t.fund_id
        `;
console.log("  a b   c".replace(/[\s]{2}/g,""))
console.log(sql.replace(/(\n|\t)/g, ""))
console.log(sql.replace(/(\n|\t)/g, " ").replace(/[\s]{2}/g,""));

