import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Topic, Manager } from '../../models/models';
import { DataService } from '../../services/data.service';

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
  
  /**
   * Конструктор с инжекцией сервиса данных
   */
  constructor(private dataService: DataService) { }
  
  /**
   * Инициализация компонента - загрузка данных из сервиса
   */
  ngOnInit(): void {
    // Получаем данные из сервиса
    this.managers = this.dataService.getManagers();
    this.topics = this.dataService.getTopics();
    
    // Подписываемся на изменения данных
    this.dataService.managers$.subscribe(managers => {
      this.managers = managers;
    });
    
    this.dataService.topics$.subscribe(topics => {
      this.topics = topics;
    });
  }
  
  /**
   * Добавление новой темы
   * @param titlein Элемент NgModel для названия темы
   * @param managerin Элемент NgModel для руководителя темы
   */
  addTopic(titlein: NgModel, managerin: NgModel): void {
    // Проверяем, что код темы не существует
    if (this.topics.some(topic => topic.topicCode === this.newTopic.topicCode)) {
      alert('Тема с таким кодом уже существует!');
      return;
    }
    
    // Добавляем тему через сервис
    this.dataService.addTopic({...this.newTopic});
    
    // Сбрасываем валидацию и форму
    titlein.control.markAsUntouched();
    managerin.control.markAsUntouched();
    this.resetTopicForm();
  }
  
  /**
   * Сброс формы темы
   */
  resetTopicForm(): void {
    this.newTopic = {
      topicCode: '',
      topicName: '',
      managerFullName: ''
    };
  }
  
  /**
   * Добавление нового руководителя
   * @param namein Элемент NgModel для ФИО руководителя
   * @param phonein Элемент NgModel для телефона руководителя
   */
  addManager(namein: NgModel, phonein: NgModel): void {
    // Проверяем, что руководитель не существует
    if (this.managers.some(manager => manager.managerFullName === this.newManager.managerFullName)) {
      alert('Руководитель с таким ФИО уже существует!');
      return;
    }
    
    // Добавляем руководителя через сервис
    this.dataService.addManager({...this.newManager});
    
    // Сбрасываем валидацию и форму
    namein.control.markAsUntouched();
    phonein.control.markAsUntouched();
    this.resetManagerForm();
  }
  
  /**
   * Сброс формы руководителя
   */
  resetManagerForm(): void {
    this.newManager = {
      managerFullName: '',
      phone: '',
      position: ''
    };
  }
  
  /**
   * Загрузка темы для редактирования
   */
  loadTopicForEditing(): void {
    if (!this.selectedTopicCode) {
      alert('Пожалуйста, выберите тему для редактирования');
      return;
    }
    
    const topicToEdit = this.topics.find(topic => topic.topicCode === this.selectedTopicCode);
    if (topicToEdit) {
      this.selectedTopic = {...topicToEdit};
    } else {
      alert('Тема не найдена');
    }
  }
  
  /**
   * Обновление темы
   */
  updateTopic(): void {
    if (this.selectedTopic) {
      // Проверка на валидность данных
      if (!this.selectedTopic.topicName || !this.selectedTopic.managerFullName) {
        alert('Пожалуйста, заполните все поля');
        return;
      }
      
      // Обновляем тему через сервис
      this.dataService.updateTopic({...this.selectedTopic});
      this.selectedTopic = null;
    }
  }
  
  /**
   * Загрузка руководителя для редактирования
   */
  loadManagerForEditing(): void {
    if (!this.selectedManagerName) {
      alert('Пожалуйста, выберите руководителя для редактирования');
      return;
    }
    
    const managerToEdit = this.managers.find(manager => manager.managerFullName === this.selectedManagerName);
    if (managerToEdit) {
      this.selectedManager = {...managerToEdit};
    } else {
      alert('Руководитель не найден');
    }
  }
  
  /**
   * Обновление руководителя
   */
  updateManager(): void {
    if (this.selectedManager) {
      // Проверка на валидность данных
      if (!this.selectedManager.phone || !this.selectedManager.position) {
        alert('Пожалуйста, заполните все поля');
        return;
      }
      
      // Обновляем руководителя через сервис
      this.dataService.updateManager({...this.selectedManager});
      this.selectedManager = null;
    }
  }
  
  /**
   * Удаление темы
   */
  deleteTopic(topicCode: string): void {
    if (confirm('Вы уверены, что хотите удалить эту тему?')) {
      // Проверяем, используется ли тема в договорах или работах
      const usedInContracts = this.dataService.getContracts().some(contract => contract.topicCode === topicCode);
      const usedInWorks = this.dataService.getWorkOnTopics().some(work => work.topicCode === topicCode);
      
      if (usedInContracts || usedInWorks) {
        alert('Эту тему нельзя удалить, так как она используется в договорах или работах');
        return;
      }
      
      // Удаляем тему через сервис
      this.dataService.deleteTopic(topicCode);
    }
  }
  
  /**
   * Удаление руководителя
   */
  deleteManager(managerFullName: string): void {
    if (confirm('Вы уверены, что хотите удалить этого руководителя?')) {
      // Проверяем, используется ли руководитель в темах или подразделениях
      const usedInTopics = this.dataService.getTopics().some(topic => topic.managerFullName === managerFullName);
      const usedInDepartments = this.dataService.getDepartments().some(dept => dept.managerFullName === managerFullName);
      
      if (usedInTopics || usedInDepartments) {
        alert('Этого руководителя нельзя удалить, так как он назначен на темы или подразделения');
        return;
      }
      
      // Удаляем руководителя через сервис
      this.dataService.deleteManager(managerFullName);
    }
  }
  
  /**
   * Проверка формата телефона
   * @param event Событие ввода
   */
  validatePhone(event: any): void {
    const input = event.target.value;
    const formattedInput = input
      .replace(/\D/g, '')
      .substring(0, 11);
    event.target.value = formattedInput;
  }
}