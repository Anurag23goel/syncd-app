export interface Project {
  ProjectID: string;
  ProjectName: string;
  ProjectCode: string;
  ProjectDescription: string;
  StartDate: string; // ISO date string
  EndDate: string | null;
  ProjectArea: string;
  Budget: number | null;
  Currency: string | null;
  ProjectLocation: string | null;
  ProjectMapLink: string | null;
  ProjectThumbnail: string | null;
  ProjectAdminIDs: string[];
  ProjectMembers: string[];
  IsCompleted: boolean;
}

export interface ProjectDetails {
  project: {
    ProjectID: string;
    ProjectName: string;
    ProjectCode: string;
    ProjectDescription: string;
    StartDate: string;
    EndDate: string | null;
    ProjectArea: string;
    Budget: number | null;
    Currency: string | null;
    ProjectLocation: string | null;
    ProjectMapLink: string | null;
    ProjectThumbnail: string | null;
    ProjectAdminIDs: string[];
    ProjectMembers: string[];
    IsCompleted: boolean;
    isAdmin: boolean;
  };
  keyPersonnel: {
    stakeholders: any[]; // Define more specific types if available
    contractors: any[];
    clients: any[];
  };
  attendance: {
    records: {
      AttendanceID: string;
      ProjectID: string;
      Date: string;
      AttendanceRecords: {
        name: string;
        laborId: string;
        remarks: string;
        isPresent: boolean;
      }[];
      TotalPresent: number;
      TotalAbsent: number;
      CreatedBy: string;
      createdAt: string;
      updatedAt: string;
    }[];
    stats: {
      totalPresent: number;
      totalAbsent: number;
      attendanceRate: string;
    };
  };
  renderComparisons: any[]; // Define if structure is known
  tasks: {
    records: any[]; // Define if structure is known
    stats: {
      totalTasks: number;
      completed: number;
      pending: number;
      delayed: number;
      upcoming: number;
    };
  };
  inventory: {
    records: {
      InventoryID: string;
      ProjectID: string;
      ResourceName: string;
      BrandName: string;
      TotalQuantity: number;
      Cost: string;
      Category: string;
      PaymentMode: string;
      InvoiceLink: string | null;
      PhotoLink: string | null;
      createdAt: string;
      updatedAt: string;
    }[];
    transactions: {
      TransactionID: string;
      InventoryID: string;
      Quantity: number;
      TransactionType: "ADDED" | "USED";
      PhotoLink: string | null;
      TransactionDate: string;
      Note: string | null;
      UsedBy: string | null;
      createdAt: string;
      updatedAt: string;
    }[];
    stats: {
      totalItems: number;
      totalValue: number;
      totalAdded: number;
      totalUsed: number;
      totalDamaged: number;
      totalLeft: number;
      categoryBreakdown: Record<string, number>;
    };
  };
  milestones: {
    records: Milestone[];
    stats: {
      total: number;
      completed: number;
      pending: number;
    };
  };
}

export interface Milestone {
  MilestoneID: string; // Assuming an ID is returned by the API
  ProjectID: string;
  Title: string;
  Description: string;
  Status: "PENDING" | "COMPLETED";
}
