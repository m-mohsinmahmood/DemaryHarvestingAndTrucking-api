import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as getAllCrops from "./getAllCrops";
import * as getCustomerCrops from "./getCustomerCrops";
import * as getCustomerFarms from "./getCustomerFarms";
import * as getAllRecruiters from "./getAllRecruiters";
import * as getAllEmployees from "./getAllEmployees";
import * as getAllCustomers from "./getAllCustomers";
import * as getCustomerFields from "./getCustomerFields";
import * as getAllMachinery from "./getAllMachinery";
import * as getCustomerTruckingRates from "./getCustomerTruckingRate";
import * as getMotorizedVehicles from "./getAllMotorizedVehicles";
import * as getAllEmployeesSupervisors from "./getAllEmployeesSupervisors";
import * as getNonMotorizedVehicles from "./getAllNonMotorizedVehicles";
import * as getFarmingServiceType from "./getFarmingServiceType";
import * as getEmployeesWithMultRoles from "./getEmployeesMultRoles";
import * as getCustomerDestination from "./getCustomerDestination";
import * as getTruckingCompany from "./getTruckingCompany";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  try {
    switch (req.method) {
      case "GET":
        if (req.query.entity === "allCrops")
          await getAllCrops.default(context, req);
        else if (req.query.entity === "customerCrops")
          await getCustomerCrops.default(context, req);
        else if (req.query.entity === "customerFarms")
          await getCustomerFarms.default(context, req);
        else if (req.query.entity === "allRecruiters")
          await getAllRecruiters.default(context, req);
        else if (req.query.entity === "allEmployees")
          await getAllEmployees.default(context, req);
        else if (req.query.entity === "allCustomers")
          await getAllCustomers.default(context, req);
        else if (req.query.entity === "customerFields")
          await getCustomerFields.default(context, req);
        else if (req.query.entity === "allMachinery")
          await getAllMachinery.default(context, req);
        else if (req.query.entity === "allCustomersTruckingRate")
          await getCustomerTruckingRates.default(context, req);
        else if (req.query.entity === "allMotorizedVehicles")
          await getMotorizedVehicles.default(context, req);
        else if (req.query.entity === "employeeSupervisor")
          await getAllEmployeesSupervisors.default(context, req);
        else if (req.query.entity === "allNonMotorizedVehicles")
          await getNonMotorizedVehicles.default(context, req);
        else if (req.query.entity === "getFarmingServices")
          await getFarmingServiceType.default(context, req);
        else if (req.query.entity === "allSupervisors")
          await getEmployeesWithMultRoles.default(context, req);
        else if (req.query.entity === "getCustomerDestination")
          await getCustomerDestination.default(context, req);
        else if (req.query.entity === "getTruckingCompany")
          await getTruckingCompany.default(context, req);

        break;

      default:
        context.res = {
          status: 404,
          body: {
            message: "Route not found.",
          },
        };
        break;
    }
  } catch (error) {
    context.res = {
      status: 500,
      body: {
        message: error,
      },
    };
  }
};

export default httpTrigger;
