export interface reportEquipmentIssue {
      empId: string,
      equipmentId: string,
      city: string,
      state: string,
      ticketType: string,
      repairTicketId: string,
      issueCategory: string,
      severityType: string,
      status: string,
      description: string
}
export interface repairTicket {
      repairTicketId: string,
      assignedById: string,
      assignedToId: string,
      equipmentId: string,
      city: string,
      state: string,
      issueCategory: string,
      severityType: string,
      status: string,
      //   summary: string,
      description: string,
      ticketType: string,
      empId: string
}
export interface maintenanceTicket {
      repairTicketId: string,
      assignedById: string,
      assignedToId: string,
      equipmentId: string,
      city: string,
      state: string,
      issueCategory: string,
      severityType: string,
      status: string,
      //   summary: string,
      description: string,
      ticketType: string,
      empId: string

}
export interface assignTicket {
      repairTicketId: string,
      empModule: string,
      assignedById: string,
      assignedToId: string,
      equipID: string,
      city: string,
      state: string,
      issueCategory: string,
      severityType: string,
      status: string,
      summary: string,
      description: string
}
export interface completeTicket {
      summary: string;
      state: string;
      assignedById: string;
}