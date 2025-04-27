import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Department, Manager, Work, WorkOnTopic } from '../../models/models';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DepartmentsComponent implements OnInit {
  // Массив подразделений
  departments: Department[] = [];
  
  // Массив руководителей
  managers: Manager[] = [];
  
  // Массив работ
  works: Work[] = [];
  
  // Массив работ по темам выполняемых подразделениями
  workOnTopics: WorkOnTopic[] = [];
  
  // Новое подразделение
  newDepartment: Department = {
    departmentNumber: 0,
    departmentName: '',
    managerFullName: ''
  };
  
  // Новая работа
  newWork: Work = {
    workCode: '',
    workName: ''
  };
  
  // Новая работа по теме выполняемая подразделением
  newWorkOnTopic: WorkOnTopic = {
    topicCode: '',
    workCode: '',
    departmentNumber: 0,
    startDate: new Date(),
    endDate: new Date()
  };
  
  // Выбранное подразделение для редактирования
  selectedDepartment: Department | null = null;
  selectedDepartmentNumber: number = 0;
  
  // Выбранная работа для редактирования
  selectedWork: Work | null = null;
  selectedWorkCode: string = '';
  
  // Темы для выбора
  topics: { topicCode: string, topicName: string }[] = [];
  
  /**
   * Конструктор с инжекцией сервиса данных
   */
  constructor(private dataService: DataService) { }
  
  /**
   * Инициализация компонента - загрузка данных из сервиса
   */
  ngOnInit(): void {
    // Получаем начальные данные
    this.managers = this.dataService.getManagers();
    this.departments = this.dataService.getDepartments();
    this.works = this.dataService.getWorks();
    this.workOnTopics = this.dataService.getWorkOnTopics();
    this.topics = this.dataService.getTopics();
    
    // Обновляем номер нового подразделения
    this.newDepartment.departmentNumber = this.dataService.getNextDepartmentNumber();
    
    // Подписываемся на изменения данных из сервиса
    this.dataService.managers$.subscribe(managers => {
      this.managers = managers;
    });
    
    this.dataService.departments$.subscribe(departments => {
      this.departments = departments;
      // Обновляем номер нового подразделения
      this.newDepartment.departmentNumber = this.dataService.getNextDepartmentNumber();
    });
    
    this.dataService.works$.subscribe(works => {
      this.works = works;
    });
    
    this.dataService.workOnTopics$.subscribe(workOnTopics => {
      this.workOnTopics = workOnTopics;
    });
    
    this.dataService.topics$.subscribe(topics => {
      this.topics = topics;
    });
    
    // Инициализация формы нового подразделения
    this.resetWorkOnTopicForm();
  }
  
  /**
   * Добавление нового подразделения
   * @param namein Элемент NgModel для названия подразделения
   * @param managerin Элемент NgModel для руководителя подразделения
   */
  addDepartment(namein: NgModel, managerin: NgModel): void {
    if (this.departments.some(dept => dept.departmentNumber === this.newDepartment.departmentNumber)) {
      alert('Подразделение с таким номером уже существует!');
      return;
    }
    
    // Добавляем подразделение через сервис
    this.dataService.addDepartment({...this.newDepartment});
    
    namein.control.markAsUntouched();
    managerin.control.markAsUntouched();
    this.resetDepartmentForm();
  }
  
  /**
   * Сброс формы подразделения
   */
  resetDepartmentForm(): void {
    this.newDepartment = {
      departmentNumber: this.dataService.getNextDepartmentNumber(),
      departmentName: '',
      managerFullName: ''
    };
  }
  
  /**
   * Добавление новой работы
   * @param codein Элемент NgModel для кода работы
   * @param namein Элемент NgModel для названия работы
   */
  addWork(codein: NgModel, namein: NgModel): void {
    if (this.works.some(work => work.workCode === this.newWork.workCode)) {
      alert('Работа с таким кодом уже существует!');
      return;
    }
    
    // Добавляем работу через сервис
    this.dataService.addWork({...this.newWork});
    
    codein.control.markAsUntouched();
    namein.control.markAsUntouched();
    this.resetWorkForm();
  }
  
  /**
   * Сброс формы работы
   */
  resetWorkForm(): void {
    this.newWork = {
      workCode: '',
      workName: ''
    };
  }
  
  /**
   * Добавление работы по теме выполняемой подразделением
   * @param topicin Элемент NgModel для темы
   * @param workin Элемент NgModel для работы
   * @param deptin Элемент NgModel для подразделения
   * @param startin Элемент NgModel для даты начала
   * @param endin Элемент NgModel для даты окончания
   */
  addWorkOnTopic(topicin: NgModel, workin: NgModel, deptin: NgModel, startin: NgModel, endin: NgModel): void {
    const newRecord = {
      ...this.newWorkOnTopic,
      startDate: new Date(this.newWorkOnTopic.startDate),
      endDate: new Date(this.newWorkOnTopic.endDate)
    };
    
    if (this.workOnTopics.some(
      wot => wot.topicCode === newRecord.topicCode && 
             wot.workCode === newRecord.workCode && 
             wot.departmentNumber === newRecord.departmentNumber)) {
      alert('Такая запись уже существует!');
      return;
    }
    
    // Добавляем запись через сервис
    this.dataService.addWorkOnTopic(newRecord);
    
    topicin.control.markAsUntouched();
    workin.control.markAsUntouched();
    deptin.control.markAsUntouched();
    startin.control.markAsUntouched();
    endin.control.markAsUntouched();
    this.resetWorkOnTopicForm();
  }
  
  /**
   * Сброс формы работы по теме
   */
  resetWorkOnTopicForm(): void {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    
    this.newWorkOnTopic = {
      topicCode: '',
      workCode: '',
      departmentNumber: 0,
      startDate: today,
      endDate: nextYear
    };
  }
  
  /**
   * Загрузка подразделения для редактирования
   */
  loadDepartmentForEditing(): void {
    if (!this.selectedDepartmentNumber) {
      alert('Пожалуйста, выберите подразделение для редактирования');
      return;
    }
    
    const deptToEdit = this.departments.find(dept => dept.departmentNumber === this.selectedDepartmentNumber);
    if (deptToEdit) {
      this.selectedDepartment = {...deptToEdit};
    } else {
      alert('Подразделение не найдено');
    }
  }
  
  /**
   * Обновление подразделения
   */
  updateDepartment(): void {
    if (this.selectedDepartment) {
      // Проверяем валидность данных
      if (!this.selectedDepartment.departmentName || !this.selectedDepartment.managerFullName) {
        alert('Пожалуйста, заполните все поля');
        return;
      }
      
      // Обновляем подразделение через сервис
      this.dataService.updateDepartment({...this.selectedDepartment});
      this.selectedDepartment = null;
    }
  }
  
  /**
   * Загрузка работы для редактирования
   */
  loadWorkForEditing(): void {
    if (!this.selectedWorkCode) {
      alert('Пожалуйста, выберите работу для редактирования');
      return;
    }
    
    const workToEdit = this.works.find(work => work.workCode === this.selectedWorkCode);
    if (workToEdit) {
      this.selectedWork = {...workToEdit};
    } else {
      alert('Работа не найдена');
    }
  }
  
  /**
   * Обновление работы
   */
  updateWork(): void {
    if (this.selectedWork) {
      // Проверяем валидность данных
      if (!this.selectedWork.workName) {
        alert('Пожалуйста, заполните все поля');
        return;
      }
      
      // Обновляем работу через сервис
      this.dataService.updateWork({...this.selectedWork});
      this.selectedWork = null;
    }
  }
  
  /**
   * Удаление записи о работе по теме
   * @param topic Код темы
   * @param work Код работы
   * @param dept Номер подразделения
   */
  deleteWorkOnTopic(topic: string, work: string, dept: number): void {
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
      // Удаляем запись через сервис
      this.dataService.deleteWorkOnTopic(topic, work, dept);
    }
  }
  
  /**
   * Удаление подразделения
   * @param departmentNumber Номер подразделения
   */
  deleteDepartment(departmentNumber: number): void {
    if (confirm('Вы уверены, что хотите удалить это подразделение?')) {
      // Проверяем, используется ли подразделение в работах по темам
      const usedInWorks = this.workOnTopics.some(wot => wot.departmentNumber === departmentNumber);
      
      if (usedInWorks) {
        alert('Это подразделение нельзя удалить, так как оно выполняет работы по темам');
        return;
      }
      
      // Удаляем подразделение через сервис
      this.dataService.deleteDepartment(departmentNumber);
    }
  }
  
  /**
   * Удаление работы
   * @param workCode Код работы
   */
  deleteWork(workCode: string): void {
    if (confirm('Вы уверены, что хотите удалить эту работу?')) {
      // Проверяем, используется ли работа в работах по темам
      const usedInWorks = this.workOnTopics.some(wot => wot.workCode === workCode);
      
      if (usedInWorks) {
        alert('Эту работу нельзя удалить, так как она используется в работах по темам');
        return;
      }
      
      // Удаляем работу через сервис
      this.dataService.deleteWork(workCode);
    }
  }
  
  /**
   * Получение имени подразделения по его номеру
   * @param deptNumber Номер подразделения
   * @returns Название подразделения
   */
  getDepartmentName(deptNumber: number): string {
    return this.dataService.getDepartmentName(deptNumber);
  }
  
  /**
   * Получение названия работы по коду
   * @param workCode Код работы
   * @returns Название работы
   */
  getWorkName(workCode: string): string {
    return this.dataService.getWorkName(workCode);
  }
  
  /**
   * Получение названия темы по коду
   * @param topicCode Код темы
   * @returns Название темы
   */
  getTopicName(topicCode: string): string {
    return this.dataService.getTopicName(topicCode);
  }
}