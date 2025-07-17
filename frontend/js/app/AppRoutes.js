import React, {Component, lazy, Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import {PrivateRoute} from "./routes/PrivateRoute";

import "react-toastify/dist/ReactToastify.css";
import Spinner from "../app/shared/Spinner";

const Dashboard = lazy(() => import("./dashboard/Dashboard"));
const Error404 = lazy(() => import("./error-pages/Error404"));
const Error500 = lazy(() => import("./error-pages/Error500"));
const Login = lazy(() => import("./user-pages/Login"));
const Register1 = lazy(() => import("./user-pages/Register"));
/* Auth */
const Login2 = lazy(() => import("./user-pages/Login2"));
const Register2 = lazy(() => import("./user-pages/Register2"));
const Lockscreen = lazy(() => import("./user-pages/Lockscreen"));
const PasswordReset = lazy(() => import("./user-pages/PasswordReset"));
const PasswordResetCheck = lazy(() => import("./user-pages/PasswordResetCheck"));
const EmailConfirmation = lazy(() => import("./general-pages/EmailConfirmation"));
const ListUsers = lazy(() => import("./users/UsersList"));
const AddUsers = lazy(() => import("./users/UsersAdd"));
const AddLandlord = lazy(() => import("./users/LandlordAdd"))
/**/
const ListGroups = lazy(() => import("./groups/GroupList"));
const AddGroups = lazy(() => import("./groups/GroupAdd"));
const AceptApplication = lazy(() => import("./users/AcceptApplication"));
const ListPropertyContracts = lazy(() => import("./contracts/property-contracts/List"));
const AddPropertyContract = lazy(() => import("./contracts/property-contracts/Add"));
const ContractSignConfirmation = lazy(() => import("./contracts/property-contracts/ContractSignConfirmation"))

const PropetiesWizard = lazy(() => import("./properties/Add"));
const Boards = lazy(() => import("./kanban/board/BoardList"));
const board = lazy(() => import("./kanban/board/Board"));
const payments = lazy(() => import("./payment/List"));
const paymentAdd = lazy(() => import("./payment/Add"));
const fees = lazy(() => import("./fee/List"));
const feeAdd = lazy(() => import("./fee/Add"));
const discounts = lazy(() => import("./discount/List"));
const discountAdd = lazy(() => import("./discount/Add"));
const refunds = lazy(() => import("./refund/List"));
const refundAdd = lazy(() => import("./refund/Add"));
const revisions = lazy(() => import("./revision/List"));
const revisionAdd = lazy(() => import("./revision/Add"));
/* employee components */
const ListEmployee = lazy(() => import("./employees/List"));
const AddEmployee = lazy(() => import("./employees/Add"));
const ListEmployeeContract = lazy(() => import("./employees/contract/List"));
const AddEmployeeContract = lazy(() => import("./employees/contract/Add"));
/* Tenant components */
const ListTenant = lazy(() => import("./tenants/List"));
const AddTenant = lazy(() => import("./users/TenantAdd"));
const EditTenant = lazy(() => import("./tenants/Edit"));
/* Landlord components */
const ListLandlord = lazy(() => import("./landlords/List"));
/* Report templates */
const ReportTemplates = lazy(() => import("./templates/List"));
const ReportTemplateEdit = lazy(() => import("./templates/Edit"));
const ReportTemplateAdd = lazy(() => import("./templates/Add"));
/* Email */
const Email = lazy(() => import("./apps/Email"));
const EmailHistory = lazy(() => import("./email-history/List"));
/*Tower*/
const TowerList = lazy(() => import("./tower/List"))
const TowerDetails = lazy(() => import("./tower/Details"))
/* apartments */
const ApartmentList = lazy(() => import("./apartment/List"))
const ApartmentAdd = lazy(() => import("./apartment/Add"))
const ApartmentBulkAdd = lazy(() => import("./apartment/bulk/BulkAdd"))
/* commercials */
const CommercialList = lazy(() => import("./commercial/List"))
const CommercialAdd = lazy(() => import("./commercial/Add"))
const CommercialBulkAdd = lazy(() => import("./commercial/bulk/BulkAdd"))
/* villas */
const villaList = lazy(() => import("./villa/List"))
const villaAdd = lazy(() => import("./villa/Add"))
const villaBulkAdd = lazy(() => import("./villa/bulk/BulkAdd"))
/* tax rates */
const taxRates = lazy(() => import("./taxrate/List"))
const taxRatesAdd = lazy(() => import("./taxrate/Add"))
/* bill  */
const billAdd = lazy(() => import("./accounting/bill/Add"))
/* invoice */
const invoiceAdd = lazy(() => import("./accounting/invoice/Add"))
/* expense claim */
const claimAdd = lazy(() => import("./accounting/expense-claim/Add"))


const kanbanApp = lazy(() => import("./apps/KanbanBoard"))

class AppRoutes extends Component {
  render() {
    return (<Suspense fallback={<Spinner/>}>
      <Switch>
        <PrivateRoute exact path="/">
          <Redirect to="/dashboard"/>
        </PrivateRoute>
        <PrivateRoute exact path="/dashboard" component={Dashboard}/>
        <PrivateRoute exact path="/kanban" component={kanbanApp}/>
        <PrivateRoute
          component={AceptApplication}
          path="/user/accept_application/:id"
        />
        {/* user and group/permissions routes */}
        <PrivateRoute exact path="/users/list" component={ListUsers}/>
        <PrivateRoute path="/users/add/:id?" component={AddUsers}/>
        <PrivateRoute path="/landlords/add/:id?" component={AddLandlord}/>
        <PrivateRoute path="/tenants/add/:id?" component={AddTenant}/>
        <PrivateRoute exact path="/groups/list" component={ListGroups}/>
        <PrivateRoute path="/groups/add/:id?" component={AddGroups}/>
        {/* properties wizard */}
        <PrivateRoute path="/properties/wizard" component={PropetiesWizard}/>
        {/* apartment routes */}
        <PrivateRoute path="/apartment/list" component={ApartmentList}/>
        <PrivateRoute path="/apartment/add/:propertyId?" component={ApartmentAdd}/>
        <PrivateRoute path="/apartment/bulk/add" component={ApartmentBulkAdd}/>
        {/* commercial routes */}
        <PrivateRoute path="/commercial/list" component={CommercialList}/>
        <PrivateRoute path="/commercial/add/:propertyId?" component={CommercialAdd}/>
        <PrivateRoute path="/commercial/bulk/add" component={CommercialBulkAdd}/>
        {/* villa routes */}
        <PrivateRoute path="/villa/list" component={villaList}/>
        <PrivateRoute path="/villa/add/:propertyId?" component={villaAdd}/>
        <PrivateRoute path="/villa/bulk/add" component={villaBulkAdd}/>
        <PrivateRoute
          exact
          path="/apartment-contracts/list"
          component={ListPropertyContracts}
        />
        <PrivateRoute
          path="/apartment-contracts/add/:id?"
          component={AddPropertyContract}
        />
        <PrivateRoute component={TowerList} path="/tower/list"/>
        <PrivateRoute component={TowerDetails} path="/tower/details/:id"/>
        {/*Contract confirmation*/}
        ContractSignConfirmation
        <PrivateRoute component={ContractSignConfirmation} path="/property-contract/sign-request/:uidb64/:token/:contract_id"/>
        {/* Contract payments */}
        <PrivateRoute exact path="/payment/list" component={payments}/>
        <PrivateRoute path="/payment/add/:id?" component={paymentAdd}/>
        {/* Contract fees */}
        <PrivateRoute exact path="/fee/list" component={fees}/>
        <PrivateRoute path="/fee/add/:id?" component={feeAdd}/>
        {/* Contract discount */}
        <PrivateRoute exact path="/discount/list" component={discounts}/>
        <PrivateRoute path="/discount/add/:id?" component={discountAdd}/>
        {/* Contract refunds */}
        <PrivateRoute exact path="/refund/list" component={refunds}/>
        <PrivateRoute path="/refund/add/:id?" component={refundAdd}/>
        {/* Contract revions */}
        <PrivateRoute exact path="/revision/list" component={revisions}/>
        <PrivateRoute path="/revision/add/:id?" component={revisionAdd}/>
        {/* user login and sign up */}
        <Route path="/user-pages/login-1" component={Login}/>
        <Route path="/user-pages/register-1" component={Register1}/>
        {/* employee routes */}
        <PrivateRoute exact path="/employees/list" component={ListEmployee}/>
        <PrivateRoute path="/employees/add/:id?" component={AddEmployee}/>
        <PrivateRoute
          exact
          path="/employees/contracts/list"
          component={ListEmployeeContract}
        />
        <PrivateRoute
          path="/employees/contracts/add/:id?"
          component={AddEmployeeContract}
        />
        {/* Tenants routes */}
        <PrivateRoute exact path="/tenants/list" component={ListTenant}/>
        <PrivateRoute path="/tenants/add" component={AddTenant}/>
        <PrivateRoute path="/tenants/edit/:id?" component={EditTenant}/>
        {/* tasks kanban */}
        <PrivateRoute exact path="/boards" component={Boards}/>
        <PrivateRoute exact path="/boards/:id" component={board}/>
        {/* Landlord routes */}
        <PrivateRoute exact path="/landlords/list" component={ListLandlord}/>
        <PrivateRoute path="/landlords/add/:id?" component={AddLandlord}/>
        {/* tax rates */}
        <PrivateRoute exact path="/books/taxrates" component={taxRates}/>
        <PrivateRoute exact path="/books/taxrates/add/:taxId?" component={taxRatesAdd}/>
        {/* bill */}
        {/*<PrivateRoute exact path="/accounting/bill/add/:contractId/:billId?" component={billAdd}/>*/} {/*feature disabled*/}
        {/* Invoice */}
        <PrivateRoute exact path="/accounting/invoice/add/:contractId/:invoiceId?" component={invoiceAdd}/>
        {/* Expense claim */}
        <PrivateRoute exact path="/accounting/expense-claim/add/:contractId/:claimId?" component={claimAdd}/>
        {/* Email history */}
        <PrivateRoute path="/email/history" component={EmailHistory}/>
        {/* Template settings */}
        <PrivateRoute
          exact
          path="/settings/templates"
          component={ReportTemplates}
        />
        <PrivateRoute
          exact
          path="/settings/templates/edit/:id"
          component={ReportTemplateEdit}
        />
        <PrivateRoute
          exact
          path="/settings/templates/add"
          component={ReportTemplateAdd}
        />
        {/* email confirmation and approval */}
        <Route
          exact
          path="/general-pages/confirmation/:uidb64/:token"
          component={EmailConfirmation}
        />

        {/* password reset*/}
        <Route
          exact
          path="/user-pages/resetpassword/:uidb64/:token"
          component={PasswordReset}
        />

        <Route
          exact
          path="/user-pages/resetpasswordcheck"
          component={PasswordResetCheck}
        />


        {/* Auth pages */}
        <PrivateRoute path="/user-pages/login-1" component={Login}/>
        {/* <Route path="/user-pages/login-2" component={Login2}/> */}
        <Route path="/user-pages/register-1" component={Register1}/>
        {/* <Route path="/user-pages/register-2" component={Register2}/> */}
        <Route path="/user-pages/lockscreen" component={Lockscreen}/>
        {/* error pages */}
        <Route path="/error-pages/error-404" component={Error404}/>
        <Route path="/error-pages/error-500" component={Error500}/>
        <Route render={() => <Redirect to="/error-pages/error-404"/>}/>
      </Switch>
    </Suspense>);
  }
}

export default AppRoutes;
