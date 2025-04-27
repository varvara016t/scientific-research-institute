import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  Manager, 
  Department, 
  Work, 
  Topic, 
  WorkOnTopic, 
  Contract 
} from '../models/models';

/**
 * Сервис для работы с данными приложения
 * Централизует доступ к данным и управление ими
 */
@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Поведенческие субъекты для хранения данных
  private managersSubject = new BehaviorSubject<Manager[]>([]);
  private departmentsSubject = new BehaviorSubject<Department[]>([]);
  private worksSubject = new BehaviorSubject<Work[]>([]);
  private topicsSubject = new BehaviorSubject<Topic[]>([]);
  private workOnTopicsSubject = new BehaviorSubject<WorkOnTopic[]>([]);
  private contractsSubject = new BehaviorSubject<Contract[]>([]);

  // Обсервабли для компонентов
  public managers$: Observable<Manager[]> = this.managersSubject.asObservable();
  public departments$: Observable<Department[]> = this.departmentsSubject.asObservable();
  public works$: Observable<Work[]> = this.worksSubject.asObservable();
  public topics$: Observable<Topic[]> = this.topicsSubject.asObservable();
  public workOnTopics$: Observable<WorkOnTopic[]> = this.workOnTopicsSubject.asObservable();
  public contracts$: Observable<Contract[]> = this.contractsSubject.asObservable();

  constructor() {
    // Инициализация данными
    this.initializeData();
  }

  // Методы для получения текущих данных
  getManagers(): Manager[] {
    return this.managersSubject.value;
  }

  getDepartments(): Department[] {
    return this.departmentsSubject.value;
  }

  getWorks(): Work[] {
    return this.worksSubject.value;
  }

  getTopics(): Topic[] {
    return this.topicsSubject.value;
  }

  getWorkOnTopics(): WorkOnTopic[] {
    return this.workOnTopicsSubject.value;
  }

  getContracts(): Contract[] {
    return this.contractsSubject.value;
  }

  // Методы для добавления новых данных
  addManager(manager: Manager): void {
    const managers = [...this.managersSubject.value, manager];
    this.managersSubject.next(managers);
  }

  addDepartment(department: Department): void {
    const departments = [...this.departmentsSubject.value, department];
    this.departmentsSubject.next(departments);
  }

  addWork(work: Work): void {
    const works = [...this.worksSubject.value, work];
    this.worksSubject.next(works);
  }

  addTopic(topic: Topic): void {
    const topics = [...this.topicsSubject.value, topic];
    this.topicsSubject.next(topics);
  }

  addWorkOnTopic(workOnTopic: WorkOnTopic): void {
    const workOnTopics = [...this.workOnTopicsSubject.value, workOnTopic];
    this.workOnTopicsSubject.next(workOnTopics);
  }

  addContract(contract: Contract): void {
    const contracts = [...this.contractsSubject.value, contract];
    this.contractsSubject.next(contracts);
  }

  // Методы для обновления существующих данных
  updateManager(updatedManager: Manager): void {
    const managers = this.managersSubject.value.map(manager => 
      manager.managerFullName === updatedManager.managerFullName ? updatedManager : manager
    );
    this.managersSubject.next(managers);
  }

  updateDepartment(updatedDepartment: Department): void {
    const departments = this.departmentsSubject.value.map(department => 
      department.departmentNumber === updatedDepartment.departmentNumber ? updatedDepartment : department
    );
    this.departmentsSubject.next(departments);
  }

  updateWork(updatedWork: Work): void {
    const works = this.worksSubject.value.map(work => 
      work.workCode === updatedWork.workCode ? updatedWork : work
    );
    this.worksSubject.next(works);
  }

  updateTopic(updatedTopic: Topic): void {
    const topics = this.topicsSubject.value.map(topic => 
      topic.topicCode === updatedTopic.topicCode ? updatedTopic : topic
    );
    this.topicsSubject.next(topics);
  }

  updateContract(updatedContract: Contract): void {
    const contracts = this.contractsSubject.value.map(contract => 
      contract.contractNumber === updatedContract.contractNumber ? updatedContract : contract
    );
    this.contractsSubject.next(contracts);
  }

  // Методы для удаления данных
  deleteWorkOnTopic(topicCode: string, workCode: string, departmentNumber: number): void {
    const workOnTopics = this.workOnTopicsSubject.value.filter(wot => 
      !(wot.topicCode === topicCode && wot.workCode === workCode && wot.departmentNumber === departmentNumber)
    );
    this.workOnTopicsSubject.next(workOnTopics);
  }

  deleteContract(contractNumber: number): void {
    const contracts = this.contractsSubject.value.filter(contract => 
      contract.contractNumber !== contractNumber
    );
    this.contractsSubject.next(contracts);
  }
  
  deleteTopic(topicCode: string): void {
    const topics = this.topicsSubject.value.filter(topic => 
      topic.topicCode !== topicCode
    );
    this.topicsSubject.next(topics);
  }
  
  deleteManager(managerFullName: string): void {
    const managers = this.managersSubject.value.filter(manager => 
      manager.managerFullName !== managerFullName
    );
    this.managersSubject.next(managers);
  }
  
  deleteWork(workCode: string): void {
    const works = this.worksSubject.value.filter(work => 
      work.workCode !== workCode
    );
    this.worksSubject.next(works);
  }
  
  deleteDepartment(departmentNumber: number): void {
    const departments = this.departmentsSubject.value.filter(department => 
      department.departmentNumber !== departmentNumber
    );
    this.departmentsSubject.next(departments);
  }

  // Вспомогательные методы
  getTopicName(topicCode: string): string {
    const topic = this.topicsSubject.value.find(t => t.topicCode === topicCode);
    return topic ? topic.topicName : 'Неизвестная тема';
  }

  getWorkName(workCode: string): string {
    const work = this.worksSubject.value.find(w => w.workCode === workCode);
    return work ? work.workName : 'Неизвестная работа';
  }

  getDepartmentName(departmentNumber: number): string {
    const department = this.departmentsSubject.value.find(d => d.departmentNumber === departmentNumber);
    return department ? department.departmentName : 'Неизвестное подразделение';
  }

  getNextDepartmentNumber(): number {
    const departments = this.departmentsSubject.value;
    if (departments.length === 0) {
      return 1;
    }
    return Math.max(...departments.map(dept => dept.departmentNumber)) + 1;
  }

  getNextContractNumber(): number {
    const contracts = this.contractsSubject.value;
    if (contracts.length === 0) {
      return 1;
    }
    return Math.max(...contracts.map(contract => contract.contractNumber)) + 1;
  }

  // Метод для получения тем без договоров
  getAvailableTopics(): Topic[] {
    const usedTopicCodes = new Set(this.contractsSubject.value.map(contract => contract.topicCode));
    return this.topicsSubject.value.filter(topic => !usedTopicCodes.has(topic.topicCode));
  }

  // Метод для фильтрации договоров по минимальной сумме
  filterContractsByMinAmount(minAmount: number): Contract[] {
    return this.contractsSubject.value.filter(contract => contract.amount >= minAmount);
  }

  // Инициализация начальными данными для демонстрации
  private initializeData(): void {
    // Инициализация руководителей
    const managers: Manager[] = [
      { managerFullName: 'Баров Игорь Олегович', phone: '89371089784', position: 'профессор' },
      { managerFullName: 'Семченко Аркадий Федорович', phone: '89370989651', position: 'доцент' },
      { managerFullName: 'Зоткина Людмила Прокофьевна', phone: '89278390269', position: 'профессор' },
      { managerFullName: 'Краснова Ирина Сергеевна', phone: '89176878966', position: 'профессор' },
      { managerFullName: 'Агофонов Андрей Викторович', phone: '89170098861', position: 'профессор' },
      { managerFullName: 'Словова Арина Васильевна', phone: '89176547896', position: 'старший преподаватель' },
      { managerFullName: 'Слугин Аристарх Максимович', phone: '89371029384', position: 'доцент' },
      { managerFullName: 'Игнатьева Алина Васильевна', phone: '89278677687', position: 'доцент' }
    ];
    
    // Инициализация тем
    const topics: Topic[] = [
      { topicCode: '1t', topicName: 'экология', managerFullName: 'Семченко Аркадий Федорович' },
      { topicCode: '2t', topicName: 'зоология', managerFullName: 'Семченко Аркадий Федорович' },
      { topicCode: '3t', topicName: 'информатика', managerFullName: 'Зоткина Людмила Прокофьевна' },
      { topicCode: '4t', topicName: 'математика', managerFullName: 'Краснова Ирина Сергеевна' },
      { topicCode: '5t', topicName: 'философия', managerFullName: 'Агофонов Андрей Викторович' },
      { topicCode: '6t', topicName: 'биология', managerFullName: 'Баров Игорь Олегович' },
      { topicCode: '7t', topicName: 'геодезия', managerFullName: 'Игнатьева Алина Васильевна' }
    ];
    
    // Инициализация подразделений
    const departments: Department[] = [
      { departmentNumber: 10, departmentName: 'Ученый совет', managerFullName: 'Словова Арина Васильевна' },
      { departmentNumber: 11, departmentName: 'Научно-исследовательское общество', managerFullName: 'Агофонов Андрей Викторович' },
      { departmentNumber: 12, departmentName: 'Учебный отдел', managerFullName: 'Слугин Аристарх Максимович' },
      { departmentNumber: 13, departmentName: 'Факультет дополнительного образования', managerFullName: 'Игнатьева Алина Васильевна' },
      { departmentNumber: 16, departmentName: 'Общество защиты животных', managerFullName: 'Семченко Аркадий Федорович' }
    ];
    
    // Инициализация работ
    const works: Work[] = [
      { workCode: '1q', workName: 'Анализ данных' },
      { workCode: '2q', workName: 'Сбор данных' },
      { workCode: '3q', workName: 'Построение модели' },
      { workCode: '4q', workName: 'Проверка данных' },
      { workCode: '5q', workName: 'Сопоставление данных с моделью' }
    ];
    
    // Инициализация работ по темам
    const today = new Date(2024, 0, 1); // 1 января 2024
    const endDate = new Date(2025, 0, 1); // 1 января 2025
    
    const workOnTopics: WorkOnTopic[] = [
      { topicCode: '1t', workCode: '1q', departmentNumber: 10, startDate: today, endDate: endDate },
      { topicCode: '1t', workCode: '2q', departmentNumber: 13, startDate: today, endDate: endDate },
      { topicCode: '3t', workCode: '2q', departmentNumber: 12, startDate: today, endDate: endDate },
      { topicCode: '5t', workCode: '4q', departmentNumber: 11, startDate: today, endDate: endDate }
    ];

    // Инициализация договоров
    const contracts: Contract[] = [
      { contractNumber: 1, topicCode: '1t', completionDate: new Date(2026, 9, 12), conclusionDate: new Date(2025, 0, 14), amount: 15000 },
      { contractNumber: 2, topicCode: '2t', completionDate: new Date(2026, 10, 16), conclusionDate: new Date(2025, 1, 13), amount: 17000 },
      { contractNumber: 3, topicCode: '3t', completionDate: new Date(2026, 8, 14), conclusionDate: new Date(2024, 10, 15), amount: 19000 },
      { contractNumber: 4, topicCode: '4t', completionDate: new Date(2026, 10, 13), conclusionDate: new Date(2024, 8, 23), amount: 12000 },
      { contractNumber: 5, topicCode: '5t', completionDate: new Date(2026, 4, 2), conclusionDate: new Date(2025, 0, 26), amount: 23000 }
    ];

    // Устанавливаем начальные значения
    this.managersSubject.next(managers);
    this.topicsSubject.next(topics);
    this.departmentsSubject.next(departments);
    this.worksSubject.next(works);
    this.workOnTopicsSubject.next(workOnTopics);
    this.contractsSubject.next(contracts);
  }
}