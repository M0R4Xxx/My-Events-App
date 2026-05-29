import { create } from 'zustand';

/* Tipe data untuk opsi pengurutan (sorting) daftar tamu */
type SortType = 'newest' | 'oldest' | 'name_asc' | 'name_desc';
interface RsvpSortStore {
  sortType: SortType;
  setSortType: (type: SortType) => void;
}

/* Membuat store Zustand untuk menyimpan state pengurutan secara global */
export const useRsvpSortStore = create<RsvpSortStore>((set) => ({
  sortType: 'newest',
  setSortType: (type) => set({ sortType: type }),
}));    