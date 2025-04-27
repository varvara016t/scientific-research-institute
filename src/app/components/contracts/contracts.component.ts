import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Contract, Topic } from '../../models/models';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ContractsComponent implements OnInit {
  // Массив договоров
  contracts: Contract[] = [];
  
  // Массив тем
  topics: Topic[] = [];
  
  // Темы без договоров (для добавления новых)
  availableTopics: Topic[] = [];
  
  // Новый договор
  newContract: Contract = {
    contractNumber: 0,
    topicCode: '',
    completionDate: new Date(),
    conclusionDate: new Date(),
    amount: 0
  };
  
  // Выбранный договор для редактирования
  selectedContract: Contract | null = null;
  selectedContractNumber: number = 0;
  
  // Фильтр по минимальной сумме
  minAmount: number = 0;
  
  // Отфильтрованные договоры
  filteredContracts: Contract[] = [];
  
  // Свойства для статистики
  totalAmount: number = 0;
  averageAmount: number = 0;
  earliestCompletionDate: string = 'Нет данных';
  latestCompletionDate: string = 'Нет данных';
  
  /**
   * Конструктор с инжекцией сервиса данных
   */
  constructor(private dataService: DataService) { }
  
  /**
   * Инициализация компонента
   */
  ngOnInit(): void {
    // Получаем начальные данные
    this.contracts = this.dataService.getContracts();
    this.topics = this.dataService.getTopics();
    this.updateAvailableTopics();
    this.applyFilter();
    this.updateStatistics();
    
    // Подписываемся на изменения данных из сервиса
    this.dataService.contracts$.subscribe(contracts => {
      this.contracts = contracts;
      this.applyFilter();
      this.updateStatistics();
      this.updateAvailableTopics();
    });
    
    this.dataService.topics$.subscribe(topics => {
      this.topics = topics;
      this.updateAvailableTopics();
    });
    
    // Инициализация формы нового договора
    this.resetContractForm();
  }
  
  /**
   * Обновление статистических данных
   */
  updateStatistics(): void {
    if (this.contracts.length > 0) {
      // Общая сумма
      this.totalAmount = this.contracts.reduce((sum, contract) => sum + contract.amount, 0);
      
      // Средняя сумма
      this.averageAmount = Math.round(this.totalAmount / this.contracts.length);
      
      // Самая ранняя дата завершения
      const earliestContract = this.contracts.reduce(
        (earliest, contract) => 
          earliest.completionDate < contract.completionDate ? earliest : contract, 
        this.contracts[0]
      );
      this.earliestCompletionDate = this.formatDate(earliestContract.completionDate);
      
      // Самая поздняя дата завершения
      const latestContract = this.contracts.reduce(
        (latest, contract) => 
          latest.completionDate > contract.completionDate ? latest : contract, 
        this.contracts[0]
      );
      this.latestCompletionDate = this.formatDate(latestContract.completionDate);
    } else {
      this.totalAmount = 0;
      this.averageAmount = 0;
      this.earliestCompletionDate = 'Нет данных';
      this.latestCompletionDate = 'Нет данных';
    }
  }
  
  /**
   * Форматирование даты
   * @param date Дата для форматирования
   * @returns Форматированная строка даты
   */
  formatDate(date: Date): string {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
  
  /**
   * Добавление нового договора
   * @param topicin Элемент NgModel для темы
   * @param completionin Элемент NgModel для даты завершения
   * @param conclusionin Элемент NgModel для даты заключения
   * @param amountin Элемент NgModel для суммы
   */
  addContract(topicin: NgModel, completionin: NgModel, conclusionin: NgModel, amountin: NgModel): void {
    if (this.contracts.some(contract => contract.contractNumber === this.newContract.contractNumber)) {
      alert('Договор с таким номером уже существует!');
      return;
    }
    
    if (this.contracts.some(contract => contract.topicCode === this.newContract.topicCode)) {
      alert('Для этой темы уже существует договор!');
      return;
    }
    
    if (this.newContract.completionDate <= this.newContract.conclusionDate) {
      alert('Дата завершения должна быть позже даты заключения!');
      return;
    }
    
    // Добавляем договор через сервис
    this.dataService.addContract({...this.newContract});
    
    topicin.control.markAsUntouched();
    completionin.control.markAsUntouched();
    conclusionin.control.markAsUntouched();
    amountin.control.markAsUntouched();
    
    this.resetContractForm();
  }
  
  /**
   * Сброс формы договора
   */
  resetContractForm(): void {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    
    this.newContract = {
      contractNumber: this.dataService.getNextContractNumber(),
      topicCode: this.availableTopics.length > 0 ? this.availableTopics[0].topicCode : '',
      completionDate: nextYear,
      conclusionDate: today,
      amount: 0
    };
  }
  
  /**
   * Загрузка договора для редактирования
   */
  loadContractForEditing(): void {
    if (!this.selectedContractNumber) {
      alert('Пожалуйста, выберите договор для редактирования');
      return;
    }
    
    const contractToEdit = this.contracts.find(contract => contract.contractNumber === this.selectedContractNumber);
    if (contractToEdit) {
      this.selectedContract = {
        ...contractToEdit,
        completionDate: new Date(contractToEdit.completionDate),
        conclusionDate: new Date(contractToEdit.conclusionDate)
      };
    } else {
      alert('Договор не найден');
    }
  }
  
  /**
   * Обновление договора
   */
  updateContract(): void {
    if (this.selectedContract) {
      if (this.selectedContract.completionDate <= this.selectedContract.conclusionDate) {
        alert('Дата завершения должна быть позже даты заключения!');
        return;
      }
      
      // Обновляем договор через сервис
      this.dataService.updateContract({...this.selectedContract});
      this.selectedContract = null;
    }
  }
  
  /**
   * Удаление договора
   * @param contractNumber Номер договора для удаления
   */
  deleteContract(contractNumber: number): void {
    if (confirm('Вы уверены, что хотите удалить этот договор?')) {
      // Удаляем договор через сервис
      this.dataService.deleteContract(contractNumber);
    }
  }
  
  /**
   * Получение названия темы по коду
   * @param topicCode Код темы
   * @returns Название темы
   */
  getTopicName(topicCode: string): string {
    return this.dataService.getTopicName(topicCode);
  }
  
  /**
   * Обновление списка доступных тем
   */
  updateAvailableTopics(): void {
    this.availableTopics = this.dataService.getAvailableTopics();
    
    // Если есть выбранный договор, добавить его тему в доступные
    if (this.selectedContract) {
      const selectedTopic = this.topics.find(topic => topic.topicCode === this.selectedContract!.topicCode);
      if (selectedTopic && !this.availableTopics.some(t => t.topicCode === selectedTopic.topicCode)) {
        this.availableTopics.push(selectedTopic);
      }
    }
  }
  
  /**
   * Применение фильтра
   */
  applyFilter(): void {
    this.filteredContracts = this.filterContracts();
  }
  
  /**
   * Фильтрация договоров
   * @returns Отфильтрованный список договоров
   */
  filterContracts(): Contract[] {
    return this.dataService.filterContractsByMinAmount(this.minAmount);
  }
}