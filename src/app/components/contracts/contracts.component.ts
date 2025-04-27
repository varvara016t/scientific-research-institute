import { Component, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Contract, Topic } from '../../models/models';

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
  
  constructor() { }
  
  ngOnInit(): void {
    this.initializeData();
    this.updateAvailableTopics();
    this.applyFilter();
    this.updateStatistics();
  }
  
  // Обновление статистических данных
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
  
  // Форматирование даты
  formatDate(date: Date): string {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
  
  // Добавление нового договора
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
    
    this.contracts.push({...this.newContract});
    this.filteredContracts = this.filterContracts();
    this.updateStatistics();
    
    topicin.control.markAsUntouched();
    completionin.control.markAsUntouched();
    conclusionin.control.markAsUntouched();
    amountin.control.markAsUntouched();
    
    this.updateAvailableTopics();
    this.resetContractForm();
  }
  
  // Сброс формы договора
  resetContractForm(): void {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    
    this.newContract = {
      contractNumber: this.getNextContractNumber(),
      topicCode: this.availableTopics.length > 0 ? this.availableTopics[0].topicCode : '',
      completionDate: nextYear,
      conclusionDate: today,
      amount: 0
    };
  }
  
  // Получение следующего номера договора
  getNextContractNumber(): number {
    if (this.contracts.length === 0) {
      return 1;
    }
    return Math.max(...this.contracts.map(contract => contract.contractNumber)) + 1;
  }
  
  // Загрузка договора для редактирования
  loadContractForEditing(): void {
    const contractToEdit = this.contracts.find(contract => contract.contractNumber === this.selectedContractNumber);
    if (contractToEdit) {
      this.selectedContract = {
        ...contractToEdit,
        completionDate: new Date(contractToEdit.completionDate),
        conclusionDate: new Date(contractToEdit.conclusionDate)
      };
    }
  }
  
  // Обновление договора
  updateContract(): void {
    if (this.selectedContract) {
      if (this.selectedContract.completionDate <= this.selectedContract.conclusionDate) {
        alert('Дата завершения должна быть позже даты заключения!');
        return;
      }
      
      const index = this.contracts.findIndex(contract => contract.contractNumber === this.selectedContract!.contractNumber);
      if (index !== -1) {
        this.contracts[index] = {...this.selectedContract};
        this.filteredContracts = this.filterContracts();
        this.updateStatistics();
      }
      this.selectedContract = null;
    }
  }
  
  // Удаление договора
  deleteContract(contractNumber: number): void {
    if (confirm('Вы уверены, что хотите удалить этот договор?')) {
      this.contracts = this.contracts.filter(contract => contract.contractNumber !== contractNumber);
      this.filteredContracts = this.filterContracts();
      this.updateAvailableTopics();
      this.updateStatistics();
    }
  }
  
  // Получение названия темы по коду
  getTopicName(topicCode: string): string {
    const topic = this.topics.find(t => t.topicCode === topicCode);
    return topic ? topic.topicName : 'Неизвестная тема';
  }
  
  // Обновление списка доступных тем
  updateAvailableTopics(): void {
    const usedTopicCodes = new Set(this.contracts.map(contract => contract.topicCode));
    this.availableTopics = this.topics.filter(topic => !usedTopicCodes.has(topic.topicCode));
    
    // Если есть выбранный договор, добавить его тему в доступные
    if (this.selectedContract) {
      const selectedTopic = this.topics.find(topic => topic.topicCode === this.selectedContract!.topicCode);
      if (selectedTopic && !this.availableTopics.includes(selectedTopic)) {
        this.availableTopics.push(selectedTopic);
      }
    }
  }
  
  // Применение фильтра
  applyFilter(): void {
    this.filteredContracts = this.filterContracts();
  }
  
  // Фильтрация договоров
  filterContracts(): Contract[] {
    return this.contracts.filter(contract => contract.amount >= this.minAmount);
  }
  
  // Инициализация данными для демонстрации
  private initializeData(): void {
    // Инициализация тем
    this.topics = [
      { topicCode: '1t', topicName: 'экология', managerFullName: 'Семченко Аркадий Федорович' },
      { topicCode: '2t', topicName: 'зоология', managerFullName: 'Семченко Аркадий Федорович' },
      { topicCode: '3t', topicName: 'информатика', managerFullName: 'Зоткина Людмила Прокофьевна' },
      { topicCode: '4t', topicName: 'математика', managerFullName: 'Краснова Ирина Сергеевна' },
      { topicCode: '5t', topicName: 'философия', managerFullName: 'Агофонов Андрей Викторович' },
      { topicCode: '6t', topicName: 'биология', managerFullName: 'Баров Игорь Олегович' },
      { topicCode: '7t', topicName: 'геодезия', managerFullName: 'Игнатьева Алина Васильевна' }
    ];
    
    // Инициализация договоров
    const today = new Date(2024, 0, 1); // 1 января 2024
    const nextYear = new Date(2025, 0, 1); // 1 января 2025
    
    this.contracts = [
      { contractNumber: 1, topicCode: '1t', completionDate: new Date(2026, 9, 12), conclusionDate: new Date(2025, 0, 14), amount: 15000 },
      { contractNumber: 2, topicCode: '2t', completionDate: new Date(2026, 10, 16), conclusionDate: new Date(2025, 1, 13), amount: 17000 },
      { contractNumber: 3, topicCode: '3t', completionDate: new Date(2026, 8, 14), conclusionDate: new Date(2024, 10, 15), amount: 19000 },
      { contractNumber: 4, topicCode: '4t', completionDate: new Date(2026, 10, 13), conclusionDate: new Date(2024, 8, 23), amount: 12000 },
      { contractNumber: 5, topicCode: '5t', completionDate: new Date(2026, 4, 2), conclusionDate: new Date(2025, 0, 26), amount: 23000 }
    ];
    
    // Инициализация формы нового договора
    this.newContract.contractNumber = this.getNextContractNumber();
  }
}