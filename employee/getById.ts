import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Client } from "pg";
import { config } from "../services/database/database.config";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const db = new Client(config);

  try {
    const employee_id: string = req.query.id;

    let employee_info_query = `
        SELECT 
            *
        FROM 
              "Employees" e1
        FULL JOIN "Employee_Status_Bar" e2
        ON e1."id" = e2."employee_id"
        WHERE 
              e1."id" = '${employee_id}';
      `;

    db.connect();

    let result = await db.query(employee_info_query);
    let resp;
    let status_bar;
    if (result.rows.length > 0) {
      resp = result.rows[0];
      //#region Status Bar
      status_bar = [
        {
          step: `Account Activated`,
          date: resp.created_at,
          status: true,
          show: true,
          active: true,
          click: +resp.status_step == 1 ? true : false
        },
        {
          step: `Email Sent to upload Drivers License and SS card`,
          date: resp.step_two_date,
          status:  +resp.status_step >= 2 && resp.driver_license_ss_card != null && resp.driver_license_ss_card  ? true : false,
          show: +resp.status_step >= 2 ? true : false,
          active: +resp.status_step >= 2 ? true : false,
          click: +resp.status_step == 2  ? true : false
        },
        {
          step: `Drivers License and SS card verified`,
          date: resp.step_three_date,
          status:  +resp.status_step >= 3  && resp.driver_license_ss_card == 'Verified' ? true : false,
          show: +resp.status_step >= 3 ? true : false,
          active: +resp.status_step >= 3 ? true : false,
          click: +resp.status_step == 3  ? true : false
        },
        {
          step: `Email sent to review/sign compliance docs`,
          date: resp.step_four_date,
          status:  +resp.status_step >= 4  && resp.compliance_docs != null && resp.compliance_docs ? true : false,
          show: +resp.status_step >= 4  ? true : false,
          active: +resp.status_step >= 4 ? true : false,
          click: +resp.status_step == 4  ? true : false
        },
        {
          step: `Compliance docs verified`,
          date: resp.step_five_date,
          status:  +resp.status_step >= 5  && resp.compliance_docs == 'Verified' ? true : false,
          show: +resp.status_step >= 5  ? true : false,
          active: +resp.status_step >= 5 ? true : false,
          click: +resp.status_step == 5 ? true : false
        },
        {
          step: `System creates contract`,
          date: resp.step_six_date,
          status:  +resp.status_step >= 6 ? true : false,
          show: +resp.status_step >= 6  ? true : false,
          active: +resp.status_step >= 6 ? true : false,
        },
        {
          step: `Admin reviews/approves contract`,
          date: resp.step_seven_date,
          status:  +resp.status_step >= 6 && resp.contract_created == 'Verified' ? true : false,
          show: +resp.status_step >= 6  ? true : false,
          active: +resp.status_step >= 6 ? true : false,
          click: +resp.status_step == 6  ? true : false
        },
        {
          step: `Email Sent to notify that contract and W4 posted`,
          date: resp.step_eight_date,
          status:  +resp.status_step >= 7 && resp.contract_w4 != null && resp.contract_w4 ? true : false,
          show: +resp.status_step >= 7  ? true : false,
          active: +resp.status_step >= 7 ? true : false,
          click: +resp.status_step == 7  ? true : false

        },
        {
          step: `Contract signed by employee is verified`,
          date: resp.step_nine_date,
          status:  +resp.status_step >= 8 && resp.contract_w4 == 'Verified' ? true : false,
          show: +resp.status_step >= 8 ? true : false,
          active: +resp.status_step >= 8 ? true : false,
          click: +resp.status_step == 8 ? true : false,
        },
        {
          step: `Email sent to set-up online bank account`,
          date: resp.step_nine_date,
          status:  +resp.status_step >= 9 && resp.bank_account != null && resp.bank_account ? true : false,
          show: +resp.status_step >= 9 ? true : false,
          active: +resp.status_step >= 9 ? true : false,
          click: +resp.status_step == 9 ? true : false,
        },
        {
          step: `Bank account details verified`,
          date: resp.step_nine_date,
          status:  +resp.status_step >= 10 && resp.bank_account == 'Verified' ? true : false,
          show: +resp.status_step >= 10 ? true : false,
          active: +resp.status_step >= 10 ? true : false,
          click: +resp.status_step == 10 ? true : false,
        },
        {
          step: `Email sent to complete signing and dating of some additional compliance docs including 1. Drug Policy and 2) Reprimand Policy`,
          date: resp.step_nine_date,
          status:  +resp.status_step >= 11 && resp.additional_compliance_docs != null && resp.additional_compliance_docs ? true : false,
          show: +resp.status_step >= 11 ? true : false,
          active: +resp.status_step >= 11 ? true : false,
          click: +resp.status_step == 11 ? true : false,
        },
        {
          step: `Additional compliance docs verified`,
          date: resp.step_nine_date,
          status:  +resp.status_step >= 12 && resp.additional_compliance_docs == 'Verified' ? true : false,
          show: +resp.status_step >= 12 ? true : false,
          active: +resp.status_step >= 12 ? true : false,
          click: +resp.status_step == 12 ? true : false,
        },
        {
          step: `Email sent to complete CDL training`,
          date: resp.step_nine_date,
          status:  +resp.status_step >= 13 && resp.cdl_training != null && resp.cdl_training ? true : false,
          show: +resp.status_step >= 13 ? true : false,
          active: +resp.status_step >= 13 ? true : false,
          click: +resp.status_step == 13 ? true : false,
        },
        {
          step: `CDL training verified`,
          date: resp.step_nine_date,
          status:  +resp.status_step >= 14 && resp.cdl_training == 'Verified' ? true : false,
          show: +resp.status_step >= 14 ? true : false,
          active: +resp.status_step >= 14 ? true : false,
          click: +resp.status_step == 14 ? true : false,
        },
        {
          step: `Email sent to make travel arrangements`,
          date: resp.step_nine_date,
          status:  +resp.status_step >= 15 && resp.travel_arrangements != null && resp.travel_arrangements ? true : false,
          show: +resp.status_step >= 15 ? true : false,
          active: +resp.status_step >= 15 ? true : false,
          click: +resp.status_step == 15 ? true : false,
        },
        {
          step: `Results`,
          date: resp.step_nine_date,
          status:  +resp.status_step >= 16 && resp.travel_arrangements == 'Verified' ? true : false,
          show: +resp.status_step >= 16 ? true : false,
          active: +resp.status_step >= 16 ? true : false,
          click: +resp.status_step == 16 ? true : false,
        },
      ];
      //#endregion
    }
    else {
      resp = {
        message: "No employee exists with this id.",
      };
    }


    db.end();

    context.res = {
      status: 200,
      body: {
      employee_info: resp,
      employee_status_bar: status_bar
      }
    };

    context.done();
    return;
  } catch (err) {
    db.end();
    context.res = {
      status: 500,
      body: err,
    };
    context.done();
    return;
  }
};

export default httpTrigger;
