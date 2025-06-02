class HashTable {
    constructor(size = 11, method = 'chaining') {
        this.size = size;
        this.method = method;
        this.table = new Array(size);
        this.stats = {
            totalKeys: 0,
            totalProbes: 0,
            collisions: 0,
            operations: 0
        };
        this.initializeTable();
    }

    initializeTable() {
        if (this.method === 'chaining') {
            for (let i = 0; i < this.size; i++) {
                this.table[i] = [];
            }
        } else {
            for (let i = 0; i < this.size; i++) {
                this.table[i] = { value: null, deleted: false };
            }
        }
    }

    hash1(key) {
        return key % this.size;
    }

    hash2(key) {
        return 7 - (key % 7);
    }

    insert(key) {
        const operation = { key, method: this.method, probes: [], success: false };
        
        switch (this.method) {
            case 'chaining':
                return this.insertChaining(key, operation);
            case 'linear_probing':
                return this.insertLinearProbing(key, operation);
            case 'quadratic_probing':
                return this.insertQuadraticProbing(key, operation);
            case 'double_hashing':
                return this.insertDoubleHashing(key, operation);
        }
    }

    insertChaining(key, operation) {
        const index = this.hash1(key);
        operation.probes.push(index);
        
        // 중복 체크
        if (this.table[index].includes(key)) {
            operation.success = false;
            operation.message = `키 ${key}가 이미 존재합니다.`;
            return operation;
        }

        if (this.table[index].length > 0) {
            this.stats.collisions++;
        }

        this.table[index].push(key);
        this.stats.totalKeys++;
        this.stats.totalProbes++;
        this.stats.operations++;
        
        operation.success = true;
        operation.message = `키 ${key}를 인덱스 ${index}에 삽입했습니다.`;
        return operation;
    }

    insertLinearProbing(key, operation) {
        let index = this.hash1(key);
        let probes = 0;
        
        while (probes < this.size) {
            operation.probes.push(index);
            
            if (this.table[index].value === null || this.table[index].deleted) {
                this.table[index] = { value: key, deleted: false };
                this.stats.totalKeys++;
                this.stats.totalProbes += (probes + 1);
                this.stats.operations++;
                
                if (probes > 0) this.stats.collisions++;
                
                operation.success = true;
                operation.message = `키 ${key}를 인덱스 ${index}에 삽입했습니다. (탐사 횟수: ${probes + 1})`;
                return operation;
            }
            
            if (this.table[index].value === key) {
                operation.success = false;
                operation.message = `키 ${key}가 이미 존재합니다.`;
                return operation;
            }
            
            index = (index + 1) % this.size;
            probes++;
        }
        
        operation.success = false;
        operation.message = `테이블이 가득 찼습니다.`;
        return operation;
    }

    insertQuadraticProbing(key, operation) {
        let index = this.hash1(key);
        let probes = 0;
        
        while (probes < this.size) {
            const currentIndex = (index + probes * probes) % this.size;
            operation.probes.push(currentIndex);
            
            if (this.table[currentIndex].value === null || this.table[currentIndex].deleted) {
                this.table[currentIndex] = { value: key, deleted: false };
                this.stats.totalKeys++;
                this.stats.totalProbes += (probes + 1);
                this.stats.operations++;
                
                if (probes > 0) this.stats.collisions++;
                
                operation.success = true;
                operation.message = `키 ${key}를 인덱스 ${currentIndex}에 삽입했습니다. (탐사 횟수: ${probes + 1})`;
                return operation;
            }
            
            if (this.table[currentIndex].value === key) {
                operation.success = false;
                operation.message = `키 ${key}가 이미 존재합니다.`;
                return operation;
            }
            
            probes++;
        }
        
        operation.success = false;
        operation.message = `테이블이 가득 찼습니다.`;
        return operation;
    }

    insertDoubleHashing(key, operation) {
        let index = this.hash1(key);
        const step = this.hash2(key);
        let probes = 0;
        
        while (probes < this.size) {
            const currentIndex = (index + probes * step) % this.size;
            operation.probes.push(currentIndex);
            
            if (this.table[currentIndex].value === null || this.table[currentIndex].deleted) {
                this.table[currentIndex] = { value: key, deleted: false };
                this.stats.totalKeys++;
                this.stats.totalProbes += (probes + 1);
                this.stats.operations++;
                
                if (probes > 0) this.stats.collisions++;
                
                operation.success = true;
                operation.message = `키 ${key}를 인덱스 ${currentIndex}에 삽입했습니다. (탐사 횟수: ${probes + 1})`;
                return operation;
            }
            
            if (this.table[currentIndex].value === key) {
                operation.success = false;
                operation.message = `키 ${key}가 이미 존재합니다.`;
                return operation;
            }
            
            probes++;
        }
        
        operation.success = false;
        operation.message = `테이블이 가득 찼습니다.`;
        return operation;
    }

    search(key) {
        const operation = { key, method: this.method, probes: [], success: false };
        
        switch (this.method) {
            case 'chaining':
                return this.searchChaining(key, operation);
            case 'linear_probing':
                return this.searchLinearProbing(key, operation);
            case 'quadratic_probing':
                return this.searchQuadraticProbing(key, operation);
            case 'double_hashing':
                return this.searchDoubleHashing(key, operation);
        }
    }

    searchChaining(key, operation) {
        const index = this.hash1(key);
        operation.probes.push(index);
        
        const found = this.table[index].includes(key);
        operation.success = found;
        operation.message = found ? 
            `키 ${key}를 인덱스 ${index}에서 찾았습니다.` : 
            `키 ${key}를 찾을 수 없습니다.`;
        
        return operation;
    }

    searchLinearProbing(key, operation) {
        let index = this.hash1(key);
        let probes = 0;
        
        while (probes < this.size) {
            operation.probes.push(index);
            
            if (this.table[index].value === null) {
                operation.success = false;
                operation.message = `키 ${key}를 찾을 수 없습니다.`;
                return operation;
            }
            
            if (this.table[index].value === key && !this.table[index].deleted) {
                operation.success = true;
                operation.message = `키 ${key}를 인덱스 ${index}에서 찾았습니다. (탐사 횟수: ${probes + 1})`;
                return operation;
            }
            
            index = (index + 1) % this.size;
            probes++;
        }
        
        operation.success = false;
        operation.message = `키 ${key}를 찾을 수 없습니다.`;
        return operation;
    }

    searchQuadraticProbing(key, operation) {
        let index = this.hash1(key);
        let probes = 0;
        
        while (probes < this.size) {
            const currentIndex = (index + probes * probes) % this.size;
            operation.probes.push(currentIndex);
            
            if (this.table[currentIndex].value === null) {
                operation.success = false;
                operation.message = `키 ${key}를 찾을 수 없습니다.`;
                return operation;
            }
            
            if (this.table[currentIndex].value === key && !this.table[currentIndex].deleted) {
                operation.success = true;
                operation.message = `키 ${key}를 인덱스 ${currentIndex}에서 찾았습니다. (탐사 횟수: ${probes + 1})`;
                return operation;
            }
            
            probes++;
        }
        
        operation.success = false;
        operation.message = `키 ${key}를 찾을 수 없습니다.`;
        return operation;
    }

    searchDoubleHashing(key, operation) {
        let index = this.hash1(key);
        const step = this.hash2(key);
        let probes = 0;
        
        while (probes < this.size) {
            const currentIndex = (index + probes * step) % this.size;
            operation.probes.push(currentIndex);
            
            if (this.table[currentIndex].value === null) {
                operation.success = false;
                operation.message = `키 ${key}를 찾을 수 없습니다.`;
                return operation;
            }
            
            if (this.table[currentIndex].value === key && !this.table[currentIndex].deleted) {
                operation.success = true;
                operation.message = `키 ${key}를 인덱스 ${currentIndex}에서 찾았습니다. (탐사 횟수: ${probes + 1})`;
                return operation;
            }
            
            probes++;
        }
        
        operation.success = false;
        operation.message = `키 ${key}를 찾을 수 없습니다.`;
        return operation;
    }

    delete(key) {
        const operation = { key, method: this.method, probes: [], success: false };
        
        switch (this.method) {
            case 'chaining':
                return this.deleteChaining(key, operation);
            case 'linear_probing':
            case 'quadratic_probing':
            case 'double_hashing':
                return this.deleteProbing(key, operation);
        }
    }

    deleteChaining(key, operation) {
        const index = this.hash1(key);
        operation.probes.push(index);
        
        const keyIndex = this.table[index].indexOf(key);
        if (keyIndex !== -1) {
            this.table[index].splice(keyIndex, 1);
            this.stats.totalKeys--;
            operation.success = true;
            operation.message = `키 ${key}를 삭제했습니다.`;
        } else {
            operation.success = false;
            operation.message = `키 ${key}를 찾을 수 없습니다.`;
        }
        
        return operation;
    }

    deleteProbing(key, operation) {
        const searchResult = this.search(key);
        operation.probes = searchResult.probes;
        
        if (searchResult.success) {
            const index = searchResult.probes[searchResult.probes.length - 1];
            this.table[index].deleted = true;
            this.stats.totalKeys--;
            operation.success = true;
            operation.message = `키 ${key}를 삭제했습니다.`;
        } else {
            operation.success = false;
            operation.message = `키 ${key}를 찾을 수 없습니다.`;
        }
        
        return operation;
    }

    getLoadFactor() {
        return (this.stats.totalKeys / this.size).toFixed(2);
    }

    getAverageProbes() {
        return this.stats.operations > 0 ? 
            (this.stats.totalProbes / this.stats.operations).toFixed(1) : '0.0';
    }

    getMaxChainLength() {
        if (this.method !== 'chaining') return 0;
        return Math.max(...this.table.map(chain => chain.length));
    }

    reset() {
        this.stats = {
            totalKeys: 0,
            totalProbes: 0,
            collisions: 0,
            operations: 0
        };
        this.initializeTable();
    }
}

class HashVisualization {
    constructor() {
        this.hashTable = new HashTable();
        this.methodInfo = {
            chaining: {
                name: "체이닝 (Separate Chaining)",
                description: "각 해시 버킷을 연결 리스트로 구현하여 충돌을 해결하는 방법입니다. 같은 해시 값을 가진 키들을 연결 리스트로 연결하여 저장합니다.",
                advantages: ["구현이 간단함", "로드 팩터가 1을 초과해도 동작", "삭제 연산이 용이"],
                disadvantages: ["추가 메모리 필요", "캐시 성능 저하", "포인터 오버헤드"]
            },
            linear_probing: {
                name: "선형 탐사 (Linear Probing)",
                description: "충돌 발생 시 다음 빈 슬롯을 선형적으로 찾아 저장하는 방법입니다. h(k), h(k)+1, h(k)+2, ... 순서로 탐사합니다.",
                advantages: ["메모리 효율적", "캐시 친화적", "구현이 간단"],
                disadvantages: ["1차 클러스터링 발생", "로드 팩터 제한", "삭제 복잡"]
            },
            quadratic_probing: {
                name: "이중 탐사 (Quadratic Probing)",
                description: "충돌 발생 시 이차함수적으로 탐사하는 방법입니다. h(k), h(k)+1², h(k)+2², h(k)+3², ... 순서로 탐사합니다.",
                advantages: ["1차 클러스터링 방지", "선형 탐사보다 분산", "적당한 성능"],
                disadvantages: ["2차 클러스터링 발생", "로드 팩터 제한", "구현 복잡"]
            },
            double_hashing: {
                name: "이중 해싱법 (Double Hashing)",
                description: "두 개의 해시 함수를 사용하여 탐사 간격을 결정하는 방법입니다. h1(k), h1(k)+h2(k), h1(k)+2*h2(k), ... 순서로 탐사합니다.",
                advantages: ["클러스터링 최소화", "우수한 분산 특성", "높은 성능"],
                disadvantages: ["구현 복잡", "두 해시 함수 필요", "계산 오버헤드"]
            }
        };
        this.initializeEventListeners();
        this.updateVisualization();
    }

    initializeEventListeners() {
        document.getElementById('table-size').addEventListener('change', (e) => {
            this.changeTableSize(parseInt(e.target.value));
        });

        document.getElementById('collision-method').addEventListener('change', (e) => {
            this.changeMethod(e.target.value);
        });

        document.getElementById('insert-btn').addEventListener('click', () => {
            this.performOperation('insert');
        });

        document.getElementById('search-btn').addEventListener('click', () => {
            this.performOperation('search');
        });

        document.getElementById('delete-btn').addEventListener('click', () => {
            this.performOperation('delete');
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetTable();
        });

        document.getElementById('key-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performOperation('insert');
            }
        });

        // 샘플 키 버튼들
        document.querySelectorAll('.sample-key').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const key = parseInt(e.target.dataset.key);
                document.getElementById('key-input').value = key;
                this.performOperation('insert');
            });
        });
    }

    changeTableSize(size) {
        this.hashTable = new HashTable(size, this.hashTable.method);
        this.updateVisualization();
    }

    changeMethod(method) {
        const currentSize = this.hashTable.size;
        this.hashTable = new HashTable(currentSize, method);
        this.updateMethodInfo(method);
        this.updateVisualization();
    }

    performOperation(operation) {
        const keyInput = document.getElementById('key-input');
        const key = parseInt(keyInput.value);
        
        if (isNaN(key)) {
            this.updateLog('유효한 숫자를 입력해주세요.');
            return;
        }

        let result;
        switch (operation) {
            case 'insert':
                result = this.hashTable.insert(key);
                break;
            case 'search':
                result = this.hashTable.search(key);
                break;
            case 'delete':
                result = this.hashTable.delete(key);
                break;
        }

        this.animateOperation(result);
        keyInput.value = '';
    }

    animateOperation(result) {
        const { probes, success, message } = result;
        
        // 먼저 모든 슬롯을 기본 상태로 리셋
        this.resetSlotStates();
        
        // 탐사 과정 애니메이션
        probes.forEach((index, step) => {
            setTimeout(() => {
                const slot = document.querySelector(`[data-index="${index}"]`);
                if (slot) {
                    slot.classList.add('probing');
                    if (step < probes.length - 1) {
                        // 중간 탐사 단계
                        setTimeout(() => slot.classList.remove('probing'), 300);
                    } else {
                        // 최종 단계
                        setTimeout(() => {
                            slot.classList.remove('probing');
                            slot.classList.add(success ? 'success' : 'error');
                            setTimeout(() => {
                                slot.classList.remove('success', 'error');
                                this.updateVisualization();
                            }, 600);
                        }, 300);
                    }
                }
            }, step * 400);
        });

        // 로그 업데이트
        setTimeout(() => {
            this.updateLog(message);
            this.updateStats();
        }, probes.length * 400 + 900);
    }

    resetSlotStates() {
        document.querySelectorAll('.hash-slot').forEach(slot => {
            slot.classList.remove('probing', 'success', 'error');
        });
    }

    updateVisualization() {
        const tableElement = document.getElementById('hash-table');
        tableElement.innerHTML = '';

        for (let i = 0; i < this.hashTable.size; i++) {
            const slot = document.createElement('div');
            slot.className = 'hash-slot';
            slot.dataset.index = i;

            const index = document.createElement('div');
            index.className = 'slot-index';
            index.textContent = i;
            slot.appendChild(index);

            const content = document.createElement('div');
            content.className = 'slot-content';

            if (this.hashTable.method === 'chaining') {
                this.renderChainingSlot(content, i);
                slot.classList.add(this.hashTable.table[i].length > 0 ? 'occupied' : 'empty');
            } else {
                this.renderProbingSlot(content, i);
                const slotData = this.hashTable.table[i];
                if (slotData.value === null) {
                    slot.classList.add('empty');
                } else if (slotData.deleted) {
                    slot.classList.add('deleted');
                } else {
                    slot.classList.add('occupied');
                }
            }

            slot.appendChild(content);
            tableElement.appendChild(slot);
        }

        this.updateStats();
    }

    renderChainingSlot(content, index) {
        const chain = this.hashTable.table[index];
        if (chain.length === 0) {
            content.innerHTML = '<span style="color: var(--color-text-secondary);">비어있음</span>';
        } else {
            const chainContainer = document.createElement('div');
            chainContainer.className = 'chain-container';
            
            chain.forEach(key => {
                const node = document.createElement('div');
                node.className = 'chain-node';
                node.textContent = key;
                chainContainer.appendChild(node);
            });
            
            content.appendChild(chainContainer);
        }
    }

    renderProbingSlot(content, index) {
        const slotData = this.hashTable.table[index];
        
        if (slotData.value === null) {
            content.innerHTML = '<span style="color: var(--color-text-secondary);">비어있음</span>';
        } else if (slotData.deleted) {
            content.innerHTML = '<span class="deleted-marker">DEL</span>';
        } else {
            const value = document.createElement('div');
            value.className = 'slot-value';
            value.textContent = slotData.value;
            
            const hash = document.createElement('div');
            hash.className = 'slot-hash';
            hash.textContent = `h(${slotData.value}) = ${this.hashTable.hash1(slotData.value)}`;
            
            content.appendChild(value);
            content.appendChild(hash);
        }
    }

    updateMethodInfo(method) {
        const info = this.methodInfo[method];
        document.getElementById('method-title').textContent = info.name;
        document.getElementById('method-description').textContent = info.description;
        
        const advantagesList = document.getElementById('method-advantages');
        advantagesList.innerHTML = '';
        info.advantages.forEach(advantage => {
            const li = document.createElement('li');
            li.textContent = advantage;
            advantagesList.appendChild(li);
        });
        
        const disadvantagesList = document.getElementById('method-disadvantages');
        disadvantagesList.innerHTML = '';
        info.disadvantages.forEach(disadvantage => {
            const li = document.createElement('li');
            li.textContent = disadvantage;
            disadvantagesList.appendChild(li);
        });
    }

    updateStats() {
        document.getElementById('load-factor').textContent = this.hashTable.getLoadFactor();
        document.getElementById('total-keys').textContent = this.hashTable.stats.totalKeys;
        document.getElementById('avg-probes').textContent = this.hashTable.getAverageProbes();
        document.getElementById('max-chain').textContent = this.hashTable.getMaxChainLength();
        document.getElementById('collision-count').textContent = this.hashTable.stats.collisions;
    }

    updateLog(message) {
        document.getElementById('log-content').textContent = message;
    }

    resetTable() {
        this.hashTable.reset();
        this.updateVisualization();
        this.updateLog('테이블이 초기화되었습니다.');
    }
}

// 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    new HashVisualization();
});