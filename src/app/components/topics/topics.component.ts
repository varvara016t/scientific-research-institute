import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Topic, Manager } from '../../models/models';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TopicsComponent implements OnInit {
  // Массив тем
  topics: Topic[] = [];
  // Массив руководителей
  managers: Manager[] = [];
  
  // Новая тема
  newTopic: Topic = {
    topicCode: '',
    topicName: '',
    managerFullName: ''
  };
  
  // Новый руководитель
  newManager: Manager = {
    managerFullName: '',
    phone: '',
    position: ''
  };
  
  // Выбранная тема для редактирования
  selectedTopic: Topic | null = null;
  selectedTopicCode: string = '';
  
  // Выбранный руководитель для редактирования
  selectedManager: Manager | null = null;
  selectedManagerName: string = '';
  
  // Список должностей для выбора
  positions: string[] = ['профессор', 'доцент', 'старший преподаватель', 'научный сотрудник'];
  
  constructor() { }
  
  ngOnInit(): void {
    // Инициализация данными (в реальности здесь будет запрос к API)
    this.initializeData();
  }
  
  // Добавление новой темы
  addTopic(titlein: NgModel, managerin: NgModel): void {
    // Проверяем, что код темы не существует
    if (this.topics.some(topic => topic.topicCode === this.newTopic.topicCode)) {
      alert('Тема с таким кодом уже существует!');
      return;
    }
    
    this.topics.push({...this.newTopic});
    titlein.control.markAsUntouched();
    managerin.control.markAsUntouched();
    this.resetTopicForm();
  }
  
  // Сброс формы темы
  resetTopicForm(): void {
    this.newTopic = {
      topicCode: '',
      topicName: '',
      managerFullName: ''
    };
  }
  
  // Добавление нового руководителя
  addManager(namein: NgModel, phonein: NgModel): void {
    // Проверяем, что руководитель не существует
    if (this.managers.some(manager => manager.managerFullName === this.newManager.managerFullName)) {
      alert('Руководитель с таким ФИО уже существует!');
      return;
    }
    
    this.managers.push({...this.newManager});
    namein.control.markAsUntouched();
    phonein.control.markAsUntouched();
    this.resetManagerForm();
  }
  
  // Сброс формы руководителя
  resetManagerForm(): void {
    this.newManager = {
      managerFullName: '',
      phone: '',
      position: ''
    };
  }
  
  // Загрузка темы для редактирования
  loadTopicForEditing(): void {
    const topicToEdit = this.topics.find(topic => topic.topicCode === this.selectedTopicCode);
    if (topicToEdit) {
      this.selectedTopic = {...topicToEdit};
    }
  }
  
  // Обновление темы
  updateTopic(): void {
    if (this.selectedTopic) {
      const index = this.topics.findIndex(topic => topic.topicCode === this.selectedTopic!.topicCode);
      if (index !== -1) {
        this.topics[index] = {...this.selectedTopic};
      }
      this.selectedTopic = null;
    }
  }
  
  // Загрузка руководителя для редактирования
  loadManagerForEditing(): void {
    const managerToEdit = this.managers.find(manager => manager.managerFullName === this.selectedManagerName);
    if (managerToEdit) {
      this.selectedManager = {...managerToEdit};
    }
  }
  
  // Обновление руководителя
  updateManager(): void {
    if (this.selectedManager) {
      const index = this.managers.findIndex(manager => manager.managerFullName === this.selectedManager!.managerFullName);
      if (index !== -1) {
        this.managers[index] = {...this.selectedManager};
      }
      this.selectedManager = null;
    }
  }
  
  // Проверка формата телефона
  validatePhone(event: any): void {
    const input = event.target.value;
    const formattedInput = input
      .replace(/\D/g, '')
      .substring(0, 11);
    event.target.value = formattedInput;
  }
  
  // Инициализация данными для демонстрации
  private initializeData(): void {
    // Добавляем руководителей
    this.managers = [
      { managerFullName: 'Баров Игорь Олегович', phone: '89371089784', position: 'профессор' },
      { managerFullName: 'Семченко Аркадий Федорович', phone: '89370989651', position: 'доцент' },
      { managerFullName: 'Зоткина Людмила Прокофьевна', phone: '89278390269', position: 'профессор' },
      { managerFullName: 'Краснова Ирина Сергеевна', phone: '89176878966', position: 'профессор' },
      { managerFullName: 'Агофонов Андрей Викторович', phone: '89170098861', position: 'профессор' }
    ];
    
    // Добавляем темы
    this.topics = [
      { topicCode: '1t', topicName: 'экология', managerFullName: 'Семченко Аркадий Федорович' },
      { topicCode: '2t', topicName: 'зоология', managerFullName: 'Семченко Аркадий Федорович' },
      { topicCode: '3t', topicName: 'информатика', managerFullName: 'Зоткина Людмила Прокофьевна' },
      { topicCode: '4t', topicName: 'математика', managerFullName: 'Краснова Ирина Сергеевна' },
      { topicCode: '5t', topicName: 'философия', managerFullName: 'Агофонов Андрей Викторович' }
    ];
  }
}