import { create } from 'zustand';

interface Candidate {
  id: string;
  name: string;
  party: string;
  imageUrl: string;
}

interface Vote {
  candidateId: string;
  voterAddress: string;
  timestamp: number;
  transactionHash: string;
}

interface Election {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  candidates: Candidate[];
  ongoing: boolean;
}

interface BlockchainState {
  isConnected: boolean;
  walletAddress: string | null;
  currentElection: Election | null;
  votes: Vote[];
  results: Record<string, number>;
  loadingState: 'idle' | 'connecting' | 'loading' | 'voting' | 'error';
  errorMessage: string | null;
  
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  loadElection: () => Promise<void>;
  castVote: (candidateId: string) => Promise<boolean>;
  verifyVote: (transactionHash: string) => Promise<boolean>;
  getElectionResults: () => Promise<Record<string, number>>;
}

// Mock data for the blockchain store
export const MOCK_ELECTION: Election = {
  id: '1',
  title: 'Presidential Election 2025',
  description: 'Vote for the next president of the country',
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-12-31'),
  ongoing: true,
  candidates: [
    {
      id: '1',
      name: 'Alice Johnson',
      party: 'Progressive Party',
      imageUrl: 'https://images.pexels.com/photos/5393594/pexels-photo-5393594.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '2',
      name: 'Bob Smith',
      party: 'Conservative Party',
      imageUrl: 'https://images.pexels.com/photos/5792641/pexels-photo-5792641.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: '3',
      name: 'Charlie Davis',
      party: 'Independent',
      imageUrl: 'https://images.pexels.com/photos/5212653/pexels-photo-5212653.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ]
};

// Mock results data
const MOCK_RESULTS: Record<string, number> = {
  '1': 1238,
  '2': 984,
  '3': 782
};

// This is a mock implementation; in a real app, this would connect to a blockchain
export const useBlockchainStore = create<BlockchainState>((set, get) => ({
  isConnected: false,
  walletAddress: null,
  currentElection: null,
  votes: [],
  results: {},
  loadingState: 'idle',
  errorMessage: null,
  
  connectWallet: async () => {
    set({ loadingState: 'connecting' });
    
    try {
      // Simulate blockchain connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful connection
      const mockAddress = '0x' + Math.random().toString(36).substring(2, 15);
      set({ 
        isConnected: true, 
        walletAddress: mockAddress, 
        loadingState: 'idle' 
      });
      return true;
    } catch (error) {
      set({ 
        loadingState: 'error', 
        errorMessage: 'Failed to connect wallet. Please try again.' 
      });
      return false;
    }
  },
  
  disconnectWallet: () => {
    set({ 
      isConnected: false, 
      walletAddress: null,
      loadingState: 'idle'
    });
  },
  
  loadElection: async () => {
    set({ loadingState: 'loading' });
    
    try {
      // Simulate blockchain data fetch
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Load mock election data
      set({ 
        currentElection: MOCK_ELECTION, 
        loadingState: 'idle' 
      });
    } catch (error) {
      set({ 
        loadingState: 'error', 
        errorMessage: 'Failed to load election data. Please try again.' 
      });
    }
  },
  
  castVote: async (candidateId: string) => {
    set({ loadingState: 'voting' });
    
    try {
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock successful vote
      const newVote: Vote = {
        candidateId,
        voterAddress: get().walletAddress || '',
        timestamp: Date.now(),
        transactionHash: '0x' + Math.random().toString(36).substring(2, 34)
      };
      
      set(state => ({ 
        votes: [...state.votes, newVote], 
        loadingState: 'idle' 
      }));
      
      // Update results
      set(state => {
        const updatedResults = { ...state.results };
        updatedResults[candidateId] = (updatedResults[candidateId] || 0) + 1;
        return { results: updatedResults };
      });
      
      return true;
    } catch (error) {
      set({ 
        loadingState: 'error', 
        errorMessage: 'Failed to cast vote. Please try again.' 
      });
      return false;
    }
  },
  
  verifyVote: async (transactionHash: string) => {
    set({ loadingState: 'loading' });
    
    try {
      // Simulate blockchain verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification (random success/failure for demo)
      const isVerified = Math.random() > 0.2;
      
      set({ loadingState: 'idle' });
      return isVerified;
    } catch (error) {
      set({ 
        loadingState: 'error', 
        errorMessage: 'Failed to verify vote. Please try again.' 
      });
      return false;
    }
  },
  
  getElectionResults: async () => {
    set({ loadingState: 'loading' });
    
    try {
      // Simulate blockchain data fetch
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return mock results
      set({ 
        results: MOCK_RESULTS, 
        loadingState: 'idle' 
      });
      
      return MOCK_RESULTS;
    } catch (error) {
      set({ 
        loadingState: 'error', 
        errorMessage: 'Failed to load election results. Please try again.' 
      });
      return {};
    }
  }
}));