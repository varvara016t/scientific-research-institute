import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Department, Manager, Work, WorkOnTopic } from '../../models/models';

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
  topics: { topicCode: string, topicName: string }[] = [
    { topicCode: '1t', topicName: 'экология' },
    { topicCode: '2t', topicName: 'зоология' },
    { topicCode: '3t', topicName: 'информатика' },
    { topicCode: '4t', topicName: 'математика' },
    { topicCode: '5t', topicName: 'философия' },
  ];
  
  constructor() { }
  
  ngOnInit(): void {
    this.initializeData();
  }
  
  // Добавление нового подразделения
  addDepartment(namein: NgModel, managerin: NgModel): void {
    if (this.departments.some(dept => dept.departmentNumber === this.newDepartment.departmentNumber)) {
      alert('Подразделение с таким номером уже существует!');
      return;
    }
    
    this.departments.push({...this.newDepartment});
    namein.control.markAsUntouched();
    managerin.control.markAsUntouched();
    this.resetDepartmentForm();
  }
  
  // Сброс формы подразделения
  resetDepartmentForm(): void {
    this.newDepartment = {
      departmentNumber: this.getNextDepartmentNumber(),
      departmentName: '',
      managerFullName: ''
    };
  }
  
  // Получение следующего номера подразделения
  getNextDepartmentNumber(): number {
    if (this.departments.length === 0) {
      return 1;
    }
    return Math.max(...this.departments.map(dept => dept.departmentNumber)) + 1;
  }
  
  // Добавление новой работы
  addWork(codein: NgModel, namein: NgModel): void {
    if (this.works.some(work => work.workCode === this.newWork.workCode)) {
      alert('Работа с таким кодом уже существует!');
      return;
    }
    
    this.works.push({...this.newWork});
    codein.control.markAsUntouched();
    namein.control.markAsUntouched();
    this.resetWorkForm();
  }
  
  // Сброс формы работы
  resetWorkForm(): void {
    this.newWork = {
      workCode: '',
      workName: ''
    };
  }
  
  // Добавление работы по теме выполняемой подразделением
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
    
    this.workOnTopics.push(newRecord);
    topicin.control.markAsUntouched();
    workin.control.markAsUntouched();
    deptin.control.markAsUntouched();
    startin.control.markAsUntouched();
    endin.control.markAsUntouched();
    this.resetWorkOnTopicForm();
  }
  
  // Сброс формы работы по теме
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
  
  // Загрузка подразделения для редактирования
  loadDepartmentForEditing(): void {
    const deptToEdit = this.departments.find(dept => dept.departmentNumber === this.selectedDepartmentNumber);
    if (deptToEdit) {
      this.selectedDepartment = {...deptToEdit};
    }
  }
  
  // Обновление подразделения
  updateDepartment(): void {
    if (this.selectedDepartment) {
      const index = this.departments.findIndex(dept => dept.departmentNumber === this.selectedDepartment!.departmentNumber);
      if (index !== -1) {
        this.departments[index] = {...this.selectedDepartment};
      }
      this.selectedDepartment = null;
    }
  }
  
  // Загрузка работы для редактирования
  loadWorkForEditing(): void {
    const workToEdit = this.works.find(work => work.workCode === this.selectedWorkCode);
    if (workToEdit) {
      this.selectedWork = {...workToEdit};
    }
  }
  
  // Обновление работы
  updateWork(): void {
    if (this.selectedWork) {
      const index = this.works.findIndex(work => work.workCode === this.selectedWork!.workCode);
      if (index !== -1) {
        this.works[index] = {...this.selectedWork};
      }
      this.selectedWork = null;
    }
  }
  
  // Удаление записи о работе по теме
  deleteWorkOnTopic(topic: string, work: string, dept: number): void {
    if (confirm('Вы уверены, что хотите удалить эту запись?')) {
      this.workOnTopics = this.workOnTopics.filter(wot => 
        !(wot.topicCode === topic && wot.workCode === work && wot.departmentNumber === dept)
      );
    }
  }
  
  // Получение имени подразделения по его номеру
  getDepartmentName(deptNumber: number): string {
    const dept = this.departments.find(d => d.departmentNumber === deptNumber);
    return dept ? dept.departmentName : 'Неизвестное подразделение';
  }
  
  // Получение названия работы по коду
  getWorkName(workCode: string): string {
    const work = this.works.find(w => w.workCode === workCode);
    return work ? work.workName : 'Неизвестная работа';
  }
  
  // Получение названия темы по коду
  getTopicName(topicCode: string): string {
    const topic = this.topics.find(t => t.topicCode === topicCode);
    return topic ? topic.topicName : 'Неизвестная тема';
  }
  
  // Инициализация данными для демонстрации
  private initializeData(): void {
    // Инициализация руководителей
    this.managers = [
      { managerFullName: 'Словова Арина Васильевна', phone: '89176547896', position: 'старший преподаватель' },
      { managerFullName: 'Слугин Аристарх Максимович', phone: '89371029384', position: 'доцент' },
      { managerFullName: 'Игнатьева Алина Васильевна', phone: '89278677687', position: 'доцент' },
      { managerFullName: 'Агофонов Андрей Викторович', phone: '89170098861', position: 'профессор' },
      { managerFullName: 'Семченко Аркадий Федорович', phone: '89370989651', position: 'доцент' },
    ];
    
    // Инициализация подразделений
    this.departments = [
      { departmentNumber: 10, departmentName: 'Ученый совет', managerFullName: 'Словова Арина Васильевна' },
      { departmentNumber: 11, departmentName: 'Научно-исследовательское общество', managerFullName: 'Агофонов Андрей Викторович' },
      { departmentNumber: 12, departmentName: 'Учебный отдел', managerFullName: 'Слугин Аристарх Максимович' },
      { departmentNumber: 13, departmentName: 'Факультет дополнительного образования', managerFullName: 'Игнатьева Алина Васильевна' },
      { departmentNumber: 16, departmentName: 'Общество защиты животных', managerFullName: 'Семченко Аркадий Федорович' }
    ];
    
    // Инициализация работ
    this.works = [
      { workCode: '1q', workName: 'Анализ данных' },
      { workCode: '2q', workName: 'Сбор данных' },
      { workCode: '3q', workName: 'Построение модели' },
      { workCode: '4q', workName: 'Проверка данных' },
      { workCode: '5q', workName: 'Сопоставление данных с моделью' }
    ];
    
    // Инициализация работ по темам
    const today = new Date(2024, 0, 1); // 1 января 2024
    const endDate = new Date(2025, 0, 1); // 1 января 2025
    
    this.workOnTopics = [
      { topicCode: '1t', workCode: '1q', departmentNumber: 10, startDate: today, endDate: endDate },
      { topicCode: '1t', workCode: '2q', departmentNumber: 13, startDate: today, endDate: endDate },
      { topicCode: '3t', workCode: '2q', departmentNumber: 12, startDate: today, endDate: endDate },
      { topicCode: '5t', workCode: '4q', departmentNumber: 11, startDate: today, endDate: endDate }
    ];
    
    // Инициализация формы нового подразделения
    this.newDepartment.departmentNumber = this.getNextDepartmentNumber();
  }
}