// Модель для работы
export interface Work {
    workCode: string;
    workName: string;
  }
  
  // Модель для руководителя
  export interface Manager {
    managerFullName: string;
    phone: string;
    position: string;
  }
  
  // Модель для подразделения
  export interface Department {
    departmentNumber: number;
    departmentName: string;
    managerFullName: string;
  }
  
  // Модель для темы
  export interface Topic {
    topicCode: string;
    topicName: string;
    managerFullName: string;
  }
  
  // Модель для работы по теме выполняемой подразделением
  export interface WorkOnTopic {
    topicCode: string;
    workCode: string;
    departmentNumber: number;
    startDate: Date;
    endDate: Date;
  }
  
  // Модель для договора
  export interface Contract {
    contractNumber: number;
    topicCode: string;
    completionDate: Date;
    conclusionDate: Date;
    amount: number;
  }