class BaseNumberGenerator(object):
    """
    Simple object for generating sale numbers.
    """

    def next_number(self, organization):
        raise NotImplementedError


class EstimateNumberGenerator(BaseNumberGenerator):
    def next_number(self, contract):
        last = contract.estimates.all().order_by("-number").first()
        if last is not None:
            last_number = int(last.number)
        else:
            last_number = 0
        return last_number + 1


class InvoiceNumberGenerator(BaseNumberGenerator):
    def next_number(self, contract):
        last = contract.invoices.all().order_by("-number").first()
        if last is not None:
            last_number = int(last.number)
        else:
            last_number = 0
        return last_number + 1


class BillNumberGenerator(BaseNumberGenerator):
    def next_number(self, contract):
        last = contract.bills.all().order_by("-number").first()
        if last is not None:
            last_number = int(last.number)
        else:
            last_number = 0
        return last_number + 1


class ExpenseClaimNumberGenerator(BaseNumberGenerator):
    def next_number(self, contract):
        last = contract.expense_claims.all().order_by("-number").first()
        if last is not None:
            last_number = int(last.number)
        else:
            last_number = 0
        return last_number + 1
