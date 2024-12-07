export interface Manufacturer {
  id: string;
  name: string;
}

export const defaultManufacturers: Manufacturer[] = [
  { id: 'huawei', name: 'Huawei' },
  { id: 'juniper', name: 'Juniper' },
  { id: 'mikrotik', name: 'Mikrotik' },
  { id: 'fiberhome', name: 'FiberHome' },
  { id: 'nokia', name: 'Nokia' },
  { id: 'dell', name: 'Dell' },
  { id: 'ibm', name: 'IBM' },
  { id: 'lenovo', name: 'Lenovo' },
  { id: 'tplink', name: 'TP-Link' },
  { id: 'dlink', name: 'D-Link' },
  { id: 'furukawa', name: 'Furukawa' },
  { id: 'datacom', name: 'Datacom' }
];

export const loadManufacturers = (): Manufacturer[] => {
  const stored = localStorage.getItem('manufacturers');
  if (!stored) {
    localStorage.setItem('manufacturers', JSON.stringify(defaultManufacturers));
    return defaultManufacturers;
  }
  return JSON.parse(stored);
};

export const saveManufacturers = (manufacturers: Manufacturer[]) => {
  localStorage.setItem('manufacturers', JSON.stringify(manufacturers));
};